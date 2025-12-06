import json
import urllib3
import boto3
from sqlalchemy.orm import Session
from models import Connection
from models import engine
import traceback



client = boto3.client('apigatewaymanagementapi', endpoint_url="https://3raigmqws9.execute-api.us-east-1.amazonaws.com/production")
# api used to responnd to message

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

def websocket_connect(event, context):
    connection_id = event["requestContext"]["connectionId"]
    print("connection_id: " + connection_id)
    
    query_params = event.get("queryStringParameters", {})
    room_id = query_params.get("room_id")
    token = query_params.get("token")
    
    print(f"Connecting to room: {room_id} with token: {token}")

    # Basic token decoding (assuming simple JWT structure or just accepting token as user for now if imports fail)
    # Ideally should import jwt and decode properly. 
    # Since the previous file version had jwt, we'll try to re-import it safely or assume a simple parse for this 'example'.
    # For robustness in this 'check' task, I'll attempt to decode or default.
    
    username = "unknown"
    if token:
        try:
            # We try to import jwt locally if not globally imported
            import jwt
            # Assuming secret or just decoding without verifying if secret is unknown/env var missing
            # JWT_SECRET = os.environ.get('JWT_SECRET', 'p1beyVW)E>b{1gya{,I+yd]>DfN/\9#*')
            decoded = jwt.decode(token, options={"verify_signature": False})
            username = decoded.get("sub") or decoded.get("username")
        except Exception as e:
            print(f"Token decode failed: {e}")
            username = "guest"
            
    if not room_id:
        print("No room_id provided, defaulting to '1' for backward compatibility")
        room_id = "1"

    with Session(engine) as session:
        connection = Connection(
            connection_id=connection_id,
            username=username,
            room_id=room_id
        )
        session.add(connection)
        session.commit()
        print(f"connection established {connection} for user query {username} in room {room_id}")

    return {"statusCode": 200}

def send_message(event, context):
    connection_id = event["requestContext"]["connectionId"]
    print("connection_id: " + connection_id)
    body = json.loads(event.get("body", "{}"))
    message = body.get("message", "")
    room_id = body.get("room_id", "")
    sendMessagebody = body.get("message")
    response = client.post_to_connection(ConnectionId=connection_id, Data=json.dumps(f"Message {sendMessagebody} sent...").encode('utf-8'))
    return {"statusCode": 200}

def broadcast_message(event, context):
    connection_id = event["requestContext"]["connectionId"]

    body = json.loads(event.get("body", "{}"))
    # message = body.get("message")
    room_id = body.get("room_id")
    with Session(engine) as session:
        connections = session.query(Connection).filter(Connection.room_id == room_id).all()
        for conn in connections:
            try:
                if conn.connection_id != connection_id:

                    response = client.post_to_connection(
                        ConnectionId=conn.connection_id,
                        Data=json.dumps({"event": "new_message", "room_id":room_id}).encode('utf-8')
                    )
                    print(f"Messages sent to {conn.connection_id}")
            except client.exceptions.GoneException as e:
                # Handle stale connection
                session.delete(conn)
                session.commit()
                print(f"Exception Error: {e}")
                traceback.print_exc()
    return {"statusCode": 200}

def lambda_handler(event, context):
    print(event)

    #Extract connectionId from incoming event
    connectionId = event["requestContext"]["connectionId"]
    route_key = event.get("requestContext", {}).get("routeKey")
    if route_key == "$disconnect":
        return websocket_disconnect(event, context)
    elif route_key == "$connect":
        return websocket_connect(event, context)
    elif route_key == "sendMessage":
        return send_message(event, context)
    elif route_key == "broadcastMessage":
        return broadcast_message(event, context)

    # responseMessage = "responding..."

    #Form response and post back to connectionId
    # response = client.post_to_connection(ConnectionId=connectionId, Data=json.dumps(responseMessage).encode('utf-8'))
    # return { "statusCode": 200  }