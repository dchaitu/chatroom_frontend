import { useState } from "react"

import {LOCAL_API_PATH, REST_API_PATH} from "../constants/constants";
import {DialogTitle, Dialog, DialogHeader, DialogContent, DialogFooter} from "./ui/dialog";
import {Button} from "./ui/button";
import {Input} from "@material-tailwind/react";
import {Label} from "@radix-ui/react-menubar";

const EditUserProfile = ({ user, onClose, onUserUpdated }) => {
    const [formData, setFormData] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        avatar: user?.avatar || "",
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const access_token = localStorage.getItem("access_token");



    const handleChange = (e) => {
        // setFormData({ ...formData, [e.target.name]: e.target.value })
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${REST_API_PATH}/user/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error("Failed to update profile")
            }

            const data = await response.json()
            onUserUpdated(data)  // pass updated user back to parent
        } catch (error) {
            console.error("Error updating profile:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={true} onOpenChange={(open)=> !open && onClose()}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="block text-sm font-medium">Full Name</Label>
                        <Input
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="Enter full name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Avatar</label>
                        <Input
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            placeholder="Enter avatar URL"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Profile URL</label>
                        <Input
                            name="profile_pic"
                            value={formData.pic_url}
                            onChange={handleChange}
                            placeholder="Enter Profile Picture URL"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditUserProfile
