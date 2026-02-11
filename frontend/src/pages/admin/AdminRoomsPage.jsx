import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Percent } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminRoomService } from "@/services";
import { formatCurrency } from "@/lib/utils";

/**
 * Admin Rooms Management page
 */
export function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRoom, setEditRoom] = useState(null);
  const [discountRoom, setDiscountRoom] = useState(null);
  const [editData, setEditData] = useState({ price: "" });
  const [discountData, setDiscountData] = useState({
    isActive: false,
    percentage: 0,
    startDate: "",
    endDate: "",
  });

  // Add room state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    category: "casita",
    price: "",
    totalRooms: "1",
    maxGuests: "2",
    images: "",
    amenities: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await adminRoomService.getRooms();
      setRooms(response.data || []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoom.name || !newRoom.price || !newRoom.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const roomData = {
        name: newRoom.name,
        description: newRoom.description,
        category: newRoom.category,
        price: parseFloat(newRoom.price),
        totalRooms: parseInt(newRoom.totalRooms) || 1,
        maxGuests: parseInt(newRoom.maxGuests) || 2,
        images: newRoom.images
          ? newRoom.images.split(",").map((url) => url.trim())
          : [],
        amenities: newRoom.amenities
          ? newRoom.amenities.split(",").map((a) => a.trim())
          : [],
      };

      await adminRoomService.createRoom(roomData);
      toast.success("Room created successfully");
      fetchRooms();
      setShowAddDialog(false);
      setNewRoom({
        name: "",
        description: "",
        category: "casita",
        price: "",
        totalRooms: "1",
        maxGuests: "2",
        images: "",
        amenities: "",
      });
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await adminRoomService.deleteRoom(roomId);
      toast.success("Room deleted successfully");
      fetchRooms();
    } catch {
      toast.error("Failed to delete room");
    }
  };

  const handleEditPrice = async () => {
    if (!editRoom || !editData.price) return;

    try {
      await adminRoomService.updateRoom(editRoom._id, {
        price: parseFloat(editData.price),
      });
      toast.success("Price updated successfully");
      fetchRooms();
      setEditRoom(null);
    } catch {
      toast.error("Failed to update price");
    }
  };

  const handleToggleDiscount = async () => {
    if (!discountRoom) return;

    try {
      await adminRoomService.toggleDiscount(discountRoom._id, {
        isActive: discountData.isActive,
        percentage: parseFloat(discountData.percentage),
        startDate: discountData.startDate,
        endDate: discountData.endDate,
      });
      toast.success("Discount updated successfully");
      fetchRooms();
      setDiscountRoom(null);
    } catch {
      toast.error("Failed to update discount");
    }
  };

  const openEditDialog = (room) => {
    setEditRoom(room);
    setEditData({ price: room.price.toString() });
  };

  const openDiscountDialog = (room) => {
    setDiscountRoom(room);
    setDiscountData({
      isActive: room.seasonalDiscount?.isActive || false,
      percentage: room.seasonalDiscount?.percentage || 0,
      startDate: room.seasonalDiscount?.startDate?.split("T")[0] || "",
      endDate: room.seasonalDiscount?.endDate?.split("T")[0] || "",
    });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-sand-900 mb-2">
            Rooms Management
          </h1>
          <p className="text-sand-600">Manage room pricing and discounts</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Create a new accommodation for guests
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-name">Room Name *</Label>
                  <Input
                    id="room-name"
                    value={newRoom.name}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, name: e.target.value })
                    }
                    placeholder="e.g., Hillside Casita"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-category">Category *</Label>
                  <Select
                    value={newRoom.category}
                    onValueChange={(value) =>
                      setNewRoom({ ...newRoom, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casita">Casita</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="pavilion">Pavilion</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-description">Description *</Label>
                <textarea
                  id="room-description"
                  value={newRoom.description}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe the room..."
                  className="flex w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-sand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-price">Price per Night (USD) *</Label>
                  <Input
                    id="room-price"
                    type="number"
                    value={newRoom.price}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, price: e.target.value })
                    }
                    placeholder="850"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-total">Total Rooms</Label>
                  <Input
                    id="room-total"
                    type="number"
                    value={newRoom.totalRooms}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, totalRooms: e.target.value })
                    }
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-guests">Max Guests</Label>
                  <Input
                    id="room-guests"
                    type="number"
                    value={newRoom.maxGuests}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, maxGuests: e.target.value })
                    }
                    placeholder="2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-images">
                  Image URLs (comma separated)
                </Label>
                <Input
                  id="room-images"
                  value={newRoom.images}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, images: e.target.value })
                  }
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-amenities">
                  Amenities (comma separated)
                </Label>
                <Input
                  id="room-amenities"
                  value={newRoom.amenities}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, amenities: e.target.value })
                  }
                  placeholder="Private Pool, Ocean View, King Bed, Mini Bar"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRoom} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sand-900 mx-auto" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            room.images?.[0] ||
                            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=100"
                          }
                          alt={room.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <span className="font-medium">{room.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {room.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {room.hasActiveDiscount ? (
                        <div>
                          <span className="line-through text-sand-400 mr-2">
                            {formatCurrency(room.price)}
                          </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(room.effectivePrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">
                          {formatCurrency(room.price)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{room.maxGuests} guests</TableCell>
                    <TableCell>
                      {room.seasonalDiscount?.isActive ? (
                        <Badge variant="success">
                          {room.seasonalDiscount.percentage}% off
                        </Badge>
                      ) : (
                        <Badge variant="outline">None</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={room.isActive ? "default" : "destructive"}
                      >
                        {room.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(room)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Edit Price - {editRoom?.name}
                              </DialogTitle>
                              <DialogDescription>
                                Update the nightly rate for this room
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Label htmlFor="price">
                                Price per Night (USD)
                              </Label>
                              <Input
                                id="price"
                                type="number"
                                value={editData.price}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    price: e.target.value,
                                  })
                                }
                                className="mt-2"
                              />
                            </div>
                            <DialogFooter>
                              <Button onClick={handleEditPrice}>
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={discountRoom?._id === room._id}
                          onOpenChange={(open) =>
                            !open && setDiscountRoom(null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDiscountDialog(room)}
                            >
                              <Percent className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Seasonal Discount - {discountRoom?.name}
                              </DialogTitle>
                              <DialogDescription>
                                Configure seasonal pricing discount
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="discountActive"
                                  checked={discountData.isActive}
                                  onChange={(e) =>
                                    setDiscountData({
                                      ...discountData,
                                      isActive: e.target.checked,
                                    })
                                  }
                                  className="rounded"
                                />
                                <Label htmlFor="discountActive">
                                  Enable Discount
                                </Label>
                              </div>
                              <div>
                                <Label htmlFor="percentage">
                                  Discount Percentage
                                </Label>
                                <Input
                                  id="percentage"
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={discountData.percentage}
                                  onChange={(e) =>
                                    setDiscountData({
                                      ...discountData,
                                      percentage: e.target.value,
                                    })
                                  }
                                  className="mt-2"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="startDate">Start Date</Label>
                                  <Input
                                    id="startDate"
                                    type="date"
                                    value={discountData.startDate}
                                    onChange={(e) =>
                                      setDiscountData({
                                        ...discountData,
                                        startDate: e.target.value,
                                      })
                                    }
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="endDate">End Date</Label>
                                  <Input
                                    id="endDate"
                                    type="date"
                                    value={discountData.endDate}
                                    onChange={(e) =>
                                      setDiscountData({
                                        ...discountData,
                                        endDate: e.target.value,
                                      })
                                    }
                                    className="mt-2"
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleToggleDiscount}>
                                Save Discount
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteRoom(room._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminRoomsPage;
