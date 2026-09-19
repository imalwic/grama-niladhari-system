"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Calendar, Plus, MapPin, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function GnOfficerEvents() {
  const t = useTranslations("GNOfficer");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // New event state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");

  const [rsvps, setRsvps] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:3001/events/gn", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/events", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description, eventDate: new Date(eventDate).toISOString(), location }),
      });
      if (res.ok) {
        setIsDialogOpen(false);
        setTitle("");
        setDescription("");
        setEventDate("");
        setLocation("");
        await fetchEvents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const loadRsvps = async (evt: any) => {
    setSelectedEvent(evt);
    try {
      const res = await fetch(`http://localhost:3001/events/${evt.id}/rsvps`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setRsvps(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400 flex items-center gap-2">
            <Calendar className="h-6 w-6" /> {t("communityEventsTitle")}
          </h1>
          <p className="text-muted-foreground">{t("organizeEventsDesc")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> {t("scheduleEventBtn")}
            </Button>
          } />
          <DialogContent>
            <form onSubmit={handleCreateEvent}>
              <DialogHeader>
                <DialogTitle>Schedule Community Event</DialogTitle>
                <DialogDescription>{t("addEventDesc")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t("eventTitleLabel")}</Label>
                  <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder={t("eventTitlePlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("descriptionLabel")}</Label>
                  <Textarea required value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("dateTimeLabel")}</Label>
                    <Input type="datetime-local" required value={eventDate} onChange={e => setEventDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("locationLabel")}</Label>
                    <Input required value={location} onChange={e => setLocation(e.target.value)} placeholder={t("locationPlaceholder")} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>{t("scheduleEventBtn")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(evt => {
           const date = new Date(evt.eventDate);
           const isUpcoming = date > new Date();
           return (
          <div key={evt.id} className="border rounded-lg p-4 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight">{evt.title}</h3>
                <Badge variant={isUpcoming ? "default" : "secondary"} className={isUpcoming ? "bg-blue-600" : ""}>
                  {isUpcoming ? t("upcomingBadge") : t("pastBadge")}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{evt.description}</p>
              
              <div className="space-y-2 text-sm text-slate-500 mb-4">
                 <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{date.toLocaleString()}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{evt.location}</span>
                 </div>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger render={
                <Button variant="outline" className="w-full mt-2" onClick={() => loadRsvps(evt)}>
                  {t("viewRsvpsBtn")} ({evt._count?.rsvps || 0})
                </Button>
              } />
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>{evt.title} - {t("rsvpsTitle")}</DialogTitle>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("residentNameCol")}</TableHead>
                      <TableHead>{t("householdNoCol")}</TableHead>
                      <TableHead>{t("statusCol")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rsvps.map(rsvp => (
                      <TableRow key={rsvp.id || `${rsvp.eventId}-${rsvp.residentId}`}>
                        <TableCell className="font-medium">{rsvp.resident?.fullName}</TableCell>
                        <TableCell className="font-mono">{rsvp.resident?.household?.houseNumber}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={rsvp.status === 'GOING' ? 'default' : rsvp.status === 'DECLINED' ? 'destructive' : 'secondary'}
                            className={rsvp.status === 'GOING' ? 'bg-green-600' : ''}
                          >
                            {rsvp.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {rsvps.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">{t("noRsvpsFound")}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </div>
        )})}
        {!loading && events.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed rounded-lg text-muted-foreground">
            {t("noEventsFound")}
          </div>
        )}
      </div>
    </div>
  );
}
