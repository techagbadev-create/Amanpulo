import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Percent,
  Upload,
  Link,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
 * Image Upload Component with preview
 */
function ImageUploader({
  imageFiles,
  setImageFiles,
  imageUrls,
  setImageUrls,
  existingImages = [],
  onRemoveExisting,
}) {
  const fileInputRef = useRef(null);
  const [newUrl, setNewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });
    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const addUrl = () => {
    if (!newUrl.trim()) return;
    try {
      new URL(newUrl);
      setImageUrls((prev) => [...prev, newUrl.trim()]);
      setNewUrl("");
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  const removeFile = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUrl = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drag and drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-sand-900 bg-sand-50"
            : "border-sand-300 hover:border-sand-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-sand-400" />
        <p className="text-sm text-sand-600 mb-2">
          Drag & drop images here, or{" "}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sand-900 underline hover:no-underline"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-sand-400">
          JPEG, PNG, GIF, WebP up to 5MB each
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Paste image URL here..."
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addUrl())
            }
          />
        </div>
        <Button type="button" variant="outline" onClick={addUrl}>
          <Link className="h-4 w-4 mr-2" />
          Add URL
        </Button>
      </div>

      {/* Preview grid */}
      {(existingImages.length > 0 ||
        imageFiles.length > 0 ||
        imageUrls.length > 0) && (
        <div className="space-y-2">
          <Label>Image Preview</Label>
          <div className="grid grid-cols-4 gap-3">
            {/* Existing images */}
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <img
                  src={url}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <Badge
                  className="absolute top-1 left-1 text-xs"
                  variant="secondary"
                >
                  Current
                </Badge>
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}

            {/* New file uploads */}
            {imageFiles.map((file, index) => (
              <div key={`file-${index}`} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-green-300"
                />
                <Badge className="absolute top-1 left-1 text-xs bg-green-500">
                  New
                </Badge>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* URL images */}
            {imageUrls.map((url, index) => (
              <div key={`url-${index}`} className="relative group">
                <img
                  src={url}
                  alt={`URL ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-blue-300"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%239ca3af'%3EError%3C/text%3E%3C/svg%3E";
                  }}
                />
                <Badge className="absolute top-1 left-1 text-xs bg-blue-500">
                  URL
                </Badge>
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Admin Rooms Management page
 */
export function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRoom, setEditRoom] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [discountRoom, setDiscountRoom] = useState(null);

  // Edit form state
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    category: "casita",
    price: "",
    totalRooms: "1",
    maxGuests: "2",
    includedGuests: "2",
    extraGuestPrice: "0",
    amenities: "",
  });
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editImageUrls, setEditImageUrls] = useState([]);
  const [editExistingImages, setEditExistingImages] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Discount state
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
    includedGuests: "2",
    extraGuestPrice: "0",
    amenities: "",
  });
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImageUrls, setNewImageUrls] = useState([]);
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

  const resetNewRoomForm = () => {
    setNewRoom({
      name: "",
      description: "",
      category: "casita",
      price: "",
      totalRooms: "1",
      maxGuests: "2",
      includedGuests: "2",
      extraGuestPrice: "0",
      amenities: "",
    });
    setNewImageFiles([]);
    setNewImageUrls([]);
  };

  const handleCreateRoom = async () => {
    if (!newRoom.name || !newRoom.price || !newRoom.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newImageFiles.length === 0 && newImageUrls.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsCreating(true);
    try {
      const roomData = {
        name: newRoom.name,
        description: newRoom.description,
        category: newRoom.category,
        basePrice: parseFloat(newRoom.price),
        totalRooms: parseInt(newRoom.totalRooms) || 1,
        maxGuests: parseInt(newRoom.maxGuests) || 2,
        includedGuests: parseInt(newRoom.includedGuests) || 2,
        extraGuestPrice: parseFloat(newRoom.extraGuestPrice) || 0,
        amenities: newRoom.amenities
          ? newRoom.amenities
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
      };

      await adminRoomService.createRoom(roomData, newImageFiles, newImageUrls);
      toast.success("Room created successfully");
      fetchRooms();
      setShowAddDialog(false);
      resetNewRoomForm();
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error(error.response?.data?.message || "Failed to create room");
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

  const handleEditRoom = async () => {
    if (
      !editRoom ||
      !editData.name ||
      !editData.price ||
      !editData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const totalImages =
      editExistingImages.length + editImageFiles.length + editImageUrls.length;
    if (totalImages === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsUpdating(true);
    try {
      const roomData = {
        name: editData.name,
        description: editData.description,
        category: editData.category,
        basePrice: parseFloat(editData.price),
        totalRooms: parseInt(editData.totalRooms) || 1,
        maxGuests: parseInt(editData.maxGuests) || 2,
        includedGuests: parseInt(editData.includedGuests) || 2,
        extraGuestPrice: parseFloat(editData.extraGuestPrice) || 0,
        amenities: editData.amenities
          ? editData.amenities
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
      };

      // Combine existing images with new URLs
      const allUrls = [...editExistingImages, ...editImageUrls];

      await adminRoomService.updateRoom(
        editRoom._id,
        roomData,
        editImageFiles,
        allUrls,
        false,
      );

      toast.success("Room updated successfully");
      fetchRooms();
      setShowEditDialog(false);
      setEditRoom(null);
    } catch (error) {
      console.error("Failed to update room:", error);
      toast.error(error.response?.data?.message || "Failed to update room");
    } finally {
      setIsUpdating(false);
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
    setEditData({
      name: room.name || "",
      description: room.description || "",
      category: room.category || "casita",
      price: (room.basePrice || room.price)?.toString() || "",
      totalRooms: room.totalRooms?.toString() || "1",
      maxGuests: room.maxGuests?.toString() || "2",
      includedGuests: room.includedGuests?.toString() || "2",
      extraGuestPrice: room.extraGuestPrice?.toString() || "0",
      amenities: room.amenities?.join(", ") || "",
    });
    setEditExistingImages(room.images || []);
    setEditImageFiles([]);
    setEditImageUrls([]);
    setShowEditDialog(true);
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

  const removeExistingImage = (index) => {
    setEditExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-sand-900 mb-2">
            Rooms Management
          </h1>
          <p className="text-sand-600">
            Manage room pricing, images, and discounts
          </p>
        </div>

        {/* Add Room Dialog */}
        <Dialog
          open={showAddDialog}
          onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetNewRoomForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Create a new accommodation with images
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-price">Base Price per Night *</Label>
                  <Input
                    id="room-price"
                    type="number"
                    value={newRoom.price}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, price: e.target.value })
                    }
                    placeholder="4150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-extra">Extra Guest Price</Label>
                  <Input
                    id="room-extra"
                    type="number"
                    value={newRoom.extraGuestPrice}
                    onChange={(e) =>
                      setNewRoom({
                        ...newRoom,
                        extraGuestPrice: e.target.value,
                      })
                    }
                    placeholder="1200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="room-included">Included Guests</Label>
                  <Input
                    id="room-included"
                    type="number"
                    value={newRoom.includedGuests}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, includedGuests: e.target.value })
                    }
                    placeholder="2"
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
                    placeholder="4"
                  />
                </div>
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

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Room Images *
                </Label>
                <ImageUploader
                  imageFiles={newImageFiles}
                  setImageFiles={setNewImageFiles}
                  imageUrls={newImageUrls}
                  setImageUrls={setNewImageUrls}
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

      {/* Edit Room Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) setEditRoom(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room - {editRoom?.name}</DialogTitle>
            <DialogDescription>
              Update room details, pricing, and images
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-room-name">Room Name *</Label>
                <Input
                  id="edit-room-name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="e.g., Hillside Casita"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-room-category">Category *</Label>
                <Select
                  value={editData.category}
                  onValueChange={(value) =>
                    setEditData({ ...editData, category: value })
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
              <Label htmlFor="edit-room-description">Description *</Label>
              <textarea
                id="edit-room-description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                rows={3}
                placeholder="Describe the room..."
                className="flex w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-sand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-room-price">Base Price per Night *</Label>
                <Input
                  id="edit-room-price"
                  type="number"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({ ...editData, price: e.target.value })
                  }
                  placeholder="4150"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-room-extra">Extra Guest Price</Label>
                <Input
                  id="edit-room-extra"
                  type="number"
                  value={editData.extraGuestPrice}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      extraGuestPrice: e.target.value,
                    })
                  }
                  placeholder="1200"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-room-total">Total Rooms</Label>
                <Input
                  id="edit-room-total"
                  type="number"
                  value={editData.totalRooms}
                  onChange={(e) =>
                    setEditData({ ...editData, totalRooms: e.target.value })
                  }
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-room-included">Included Guests</Label>
                <Input
                  id="edit-room-included"
                  type="number"
                  value={editData.includedGuests}
                  onChange={(e) =>
                    setEditData({ ...editData, includedGuests: e.target.value })
                  }
                  placeholder="2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-room-guests">Max Guests</Label>
                <Input
                  id="edit-room-guests"
                  type="number"
                  value={editData.maxGuests}
                  onChange={(e) =>
                    setEditData({ ...editData, maxGuests: e.target.value })
                  }
                  placeholder="4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-room-amenities">
                Amenities (comma separated)
              </Label>
              <Input
                id="edit-room-amenities"
                value={editData.amenities}
                onChange={(e) =>
                  setEditData({ ...editData, amenities: e.target.value })
                }
                placeholder="Private Pool, Ocean View, King Bed, Mini Bar"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Room Images *
              </Label>
              <ImageUploader
                imageFiles={editImageFiles}
                setImageFiles={setEditImageFiles}
                imageUrls={editImageUrls}
                setImageUrls={setEditImageUrls}
                existingImages={editExistingImages}
                onRemoveExisting={removeExistingImage}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditRoom(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditRoom} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sand-900 mx-auto" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-sand-300 mb-4" />
              <h3 className="text-lg font-medium text-sand-900 mb-2">
                No rooms yet
              </h3>
              <p className="text-sand-600 mb-4">
                Create your first room to get started
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Images</TableHead>
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
                            room.featuredImage ||
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
                            {formatCurrency(room.basePrice || room.price)}
                          </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(room.effectivePrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">
                          {formatCurrency(room.basePrice || room.price)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{room.maxGuests} guests</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {room.images?.length || 0} images
                      </Badge>
                    </TableCell>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

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
