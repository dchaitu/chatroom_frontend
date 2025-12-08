import json
import boto3
from sqlalchemy.orm import Session
from models import Connection
from models import engine
import traceback
import jwt
import os
import time


endpoint = os.environ.get("API_GW_MANAGEMENT_ENDPOINT")
if not endpoint:
    raise Exception("API_GW_MANAGEMENT_ENDPOINT env var is not set")
print(f"endpoint {endpoint}")
client = boto3.client(
    "apigatewaymanagementapi",
    endpoint_url=endpoint,
)

def _decode_token(token: str):
    try:
        payload = jwt.decode(
            token,
            os.environ.get("JWT_SECRET", "p1beyVW)E>b{1gya{,I+yd]>DfN/#*"),
            algorithms=["HS256"],
        )
        return payload
    except Exception as e:
        print("JWT DECODE ERROR:", e)
        return None


def websocket_connect(event, context):
    connection_id = event["requestContext"]["connectionId"]
    print("connection_id: " + connection_id)
    body = json.loads(event.get("body", "{}"))
    print(f"body {body}")
    print(f"event {event}")
    params = event.get("queryStringParameters") or {}
    token = params.get("token")
    room_id = params.get("room_id")
    print(f"token {token}, room_id {room_id}")
    username = None
    if token:
        payload = _decode_token(token)
        print(f"payload {payload}")
        if payload:
            username = payload.get("sub") or payload.get("username")
    print(f"username {username}")

    with Session(engine) as session:
        connection = Connection(
            connection_id=connection_id, username=username, room_id=room_id
        )
        session.add(connection)
        session.commit()
        print(f"connection established {connection}")

    return {"statusCode": 200}


def websocket_disconnect(event, context):
    connection_id = event["requestContext"]["connectionId"]
    print("connection_id: " + connection_id)
    with Session(engine) as session:
        existing_conn = session.get(Connection, connection_id)
        if existing_conn:
            session.delete(existing_conn)
            session.commit()
        print(f"connection deleted {existing_conn}")
    return {"statusCode": 200}



def broadcast_message(event, context):
    connection_id = event["requestContext"]["connectionId"]
    body = json.loads(event.get("body", "{}"))

    with Session(engine) as session:
        connection = session.get(Connection, connection_id)
        if not connection or not connection.room_id:
            print("Connection not found or missing room_id")
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Invalid connection or room"}),
            }

        room_id = connection.room_id

        if "reply_to" in body:
            payload = {
                "event": "reply",
                "room_id": room_id,
            }
        elif "reaction" in body:
            payload = {
                "event": "reaction",
                "room_id": room_id,
            }
        else:
            payload = {
                "event": "new_message",
                "room_id": room_id,
            }

        connections = (
            session.query(Connection).filter(Connection.room_id == room_id).all()
        )
        for conn in connections:
            try:
                client.post_to_connection(
                    ConnectionId=conn.connection_id,
                    Data=json.dumps(payload),
                )
                print(f"Messages sent to {conn.connection_id}")
            except client.exceptions.GoneException as e:
                # Handle stale connection
                session.delete(conn)
                session.commit()
                print(f"Exception Error: {e}")
                traceback.print_exc()
            except Exception:
                traceback.print_exc()
    return {"statusCode": 200}


def lambda_handler(event, context):
    print(event)

    # Extract connectionId from incoming event
    connectionId = event["requestContext"]["connectionId"]
    route_key = event.get("requestContext", {}).get("routeKey")
    if route_key == "$disconnect":
        return websocket_disconnect(event, context)
    elif route_key == "$connect":
        return websocket_connect(event, context)
    elif route_key == "broadcastMessage":
        return broadcast_message(event, context)
    else:
        # default route: just echo or accept body
        return {"statusCode": 200, "body": json.dumps({"default path": True})}
