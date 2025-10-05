"use client";

import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {Switch} from "@/components/ui/switch";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {toast} from "@/hooks/use-toast";
import {
  Megaphone,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Eye,
  Send,
  Save,
  Users,
  Bell,
  FileText,
  Plus,
  X,
  CheckCircle,
} from "lucide-react";
import {format} from "date-fns";
import { apiFetch } from "@/lib/api";



interface CreateAnnouncementProps {
  user: { name: string; position: string; hall: string; email?: string };
  onNavigate?: (page: string) => void; // optional to avoid unused-var errors
}

type FormData = {
  title: string;
  content: string;
  category: string;
  priority: string;
  hall: string;
  eventDate?: Date;
  eventTime: string;
  expectedAttendees: string;
  isScheduled: boolean;
  publishDate?: Date;
  publishTime: string;
  tags: string[];
};

export function CreateAnnouncement({ user }: CreateAnnouncementProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    category: "",
    priority: "",
    hall: "",
    eventDate: undefined,
    eventTime: "",
    expectedAttendees: "",
    isScheduled: false,
    publishDate: undefined,
    publishTime: "",
    tags: [],
  });

  const [newTag, setNewTag] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const categories = [
    {value: "health", label: "Health Program", color: "bg-green-100 text-green-800"},
    {value: "meeting", label: "Meeting", color: "bg-blue-100 text-blue-800"},
    {value: "community", label: "Community Event", color: "bg-purple-100 text-purple-800"},
    {value: "social-services", label: "Social Services", color: "bg-orange-100 text-orange-800"},
    {value: "education", label: "Education", color: "bg-indigo-100 text-indigo-800"},
    {value: "emergency", label: "Emergency", color: "bg-red-100 text-red-800"},
    {value: "maintenance", label: "Maintenance", color: "bg-yellow-100 text-yellow-800"},
  ];

  const priorities = [
    {value: "low", label: "Low Priority", color: "bg-gray-100 text-gray-800"},
    {value: "medium", label: "Medium Priority", color: "bg-yellow-100 text-yellow-800"},
    {value: "high", label: "High Priority", color: "bg-red-100 text-red-800"},
    {value: "urgent", label: "Urgent", color: "bg-red-200 text-red-900"},
  ];

  const halls = ["All Halls", "Napico Hall", "Greenpark Hall", "Karangalan Hall", "Manggahan Proper Hall"];

  const handleInputChange = (field: keyof FormData, value: FormData[typeof field]) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) =>
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));

  const basePayload = () => ({
    title: formData.title,
    content: formData.content,
    category: formData.category,
    priority: formData.priority,
    hall: formData.hall,
    eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : undefined,
    eventTime: formData.eventTime || undefined,
    expectedAttendees: formData.expectedAttendees || undefined,
    tags: formData.tags,
    createdByName: user?.name,
    createdByEmail: user?.email,
  });

  const postAnnouncement = async (body: Record<string, unknown>) => {
    const res = await apiFetch('/announcements', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || `POST /announcements failed (${res.status})`);
    }
    return res.json();
  };

  const resetForm = () =>
    setFormData({
      title: "",
      content: "",
      category: "",
      priority: "",
      hall: "",
      eventDate: undefined,
      eventTime: "",
      expectedAttendees: "",
      isScheduled: false,
      publishDate: undefined,
      publishTime: "",
      tags: [],
    });

  // SAVE DRAFT => published: false (no publishedSchedule)
  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      await postAnnouncement({ ...basePayload(), published: false });
      toast({ title: "Draft Saved", description: "Your announcement has been saved as a draft." });
      resetForm();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to save draft", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // PUBLISH NOW or SCHEDULE
  const handlePublish = async () => {
    if (!formData.title || !formData.content || !formData.category || !formData.priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before publishing.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPublishing(true);

      if (formData.isScheduled) {
        if (!formData.publishDate || !formData.publishTime) {
          toast({ title: "Missing schedule", description: "Please select a publish date and time.", variant: "destructive" });
          return;
        }
        const dt = new Date(formData.publishDate);
        const [hh, mm] = (formData.publishTime || "00:00").split(":");
        dt.setHours(parseInt(hh || "0", 10), parseInt(mm || "0", 10), 0, 0);

        await postAnnouncement({ ...basePayload(), published: false, publishedSchedule: dt.toISOString() });
        toast({ title: "Scheduled!", description: "Your announcement will be published at the scheduled time." });
      } else {
        await postAnnouncement({ ...basePayload(), published: true });
        toast({ title: "Announcement Published!", description: "Your announcement has been published and residents will be notified." });
      }

      resetForm();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Publish failed", variant: "destructive" });
    } finally {
      setIsPublishing(false);
    }
  };

  const getCategoryColor = (category: string) =>
    (categories.find(c => c.value === category)?.color) || "bg-gray-100 text-gray-800";
  const getPriorityColor = (priority: string) =>
    (priorities.find(p => p.value === priority)?.color) || "bg-gray-100 text-gray-800";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Megaphone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Announcement</h1>
            <p className="text-gray-600">Share important information with the community</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Author: {user.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{user.position} • {user.hall}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>Enter the main details of your announcement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Enter announcement title..." value={formData.title}
                  onChange={e => handleInputChange("title", e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea id="content" placeholder="Write your announcement content here..." value={formData.content}
                  onChange={e => handleInputChange("content", e.target.value)} className="mt-1 min-h-[120px]" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={v => handleInputChange("category", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${c.color} text-xs`}>{c.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority *</Label>
                  <Select value={formData.priority} onValueChange={v => handleInputChange("priority", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      {priorities.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${p.color} text-xs`}>{p.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Target Hall</Label>
                <Select value={formData.hall} onValueChange={v => handleInputChange("hall", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select target hall" /></SelectTrigger>
                  <SelectContent>
                    {halls.map(h => (<SelectItem key={h} value={h}>{h}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Event Details</span>
              </CardTitle>
              <CardDescription>Add event-specific information if applicable</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.eventDate ? format(formData.eventDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={formData.eventDate}
                        onSelect={date => handleInputChange("eventDate", date as Date)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="eventTime">Event Time</Label>
                  <Input id="eventTime" type="time" value={formData.eventTime}
                    onChange={e => handleInputChange("eventTime", e.target.value)} className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="expectedAttendees">Expected Attendees</Label>
                <Input id="expectedAttendees" type="number" placeholder="Enter expected number of attendees"
                  value={formData.expectedAttendees} onChange={e => handleInputChange("expectedAttendees", e.target.value)}
                  className="mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to help categorize and search your announcement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input placeholder="Add a tag..." value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); }}} />
                <Button onClick={addTag} size="sm"><Plus className="h-4 w-4" /></Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={`${tag}-${index}`} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600" aria-label={`Remove ${tag}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Publishing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="scheduled" checked={formData.isScheduled}
                  onCheckedChange={checked => handleInputChange("isScheduled", checked)} />
                <Label htmlFor="scheduled">Schedule for later</Label>
              </div>

              {formData.isScheduled && (
                <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                  <div>
                    <Label>Publish Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.publishDate ? format(formData.publishDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={formData.publishDate}
                          onSelect={date => handleInputChange("publishDate", date as Date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="publishTime">Publish Time</Label>
                    <Input id="publishTime" type="time" value={formData.publishTime}
                      onChange={e => handleInputChange("publishTime", e.target.value)} className="mt-1" />
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <Button onClick={handlePublish}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  disabled={isPublishing}>
                  {isPublishing ? (<><Clock className="h-4 w-4 mr-2 animate-spin" />Publishing...</>) : (
                    <><Send className="h-4 w-4 mr-2" />{formData.isScheduled ? "Schedule" : "Publish Now"}</>
                  )}
                </Button>

                <Button variant="outline" onClick={handleSaveDraft} className="w-full bg-transparent" disabled={isSaving}>
                  {isSaving ? (<><Clock className="h-4 w-4 mr-2 animate-spin" />Saving...</>) : (<><Save className="h-4 w-4 mr-2" />Save Draft</>)}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />Preview Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Announcement Preview</DialogTitle>
                    <DialogDescription>This is how your announcement will appear to residents</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {formData.title || "Announcement Title"}
                              </h3>
                              {formData.priority && (
                                <Badge className={getPriorityColor(formData.priority)}>
                                  {formData.priority.toUpperCase()}
                                </Badge>
                              )}
                            </div>

                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {formData.content || "Announcement content will appear here..."}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {formData.eventDate && (
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{format(formData.eventDate, "PPP")}</span>
                                </div>
                              )}
                              {formData.eventTime && (
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  <span>{formData.eventTime}</span>
                                </div>
                              )}
                              {formData.hall && (
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <MapPin className="h-4 w-4" />
                                  <span>{formData.hall}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="ml-6 text-right">
                            {formData.expectedAttendees && (
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <Users className="h-4 w-4" />
                                <span>{formData.expectedAttendees} expected</span>
                              </div>
                            )}
                            {formData.category && (
                              <Badge variant="outline" className={getCategoryColor(formData.category)}>
                                {categories.find(c => c.value === formData.category)?.label}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-4 border-t">
                            {formData.tags.map((tag, index) => (
                              <Badge key={`${tag}-${index}`} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t mt-4">
                          <div className="text-sm text-gray-500">
                            Posted by {user.name} • {user.position}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Reach</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated Reach</span>
                  <span className="font-semibold">{formData.hall === "All Halls" ? "15,420" : "3,084"} residents</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SMS Notifications</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">App Notifications</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Website Display</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
