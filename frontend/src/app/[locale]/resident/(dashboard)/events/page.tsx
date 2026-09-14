"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function ResidentEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvping, setRsvping] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:3001/events/resident", {
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

  const handleRsvp = async (eventId: string, status: string) => {
    setRsvping(eventId);
    try {
      const res = await fetch(`http://localhost:3001/events/${eventId}/rsvp`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchEvents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRsvping(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400 flex items-center gap-2 mb-2">
          <Calendar className="h-8 w-8" /> Community Events
        </h1>
        <p className="text-muted-foreground">Stay updated on upcoming community gatherings, shramadana, and meetings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(evt => {
          const date = new Date(evt.eventDate);
          const rsvpStatus = evt.rsvps?.[0]?.status || null;
          
          return (
            <div key={evt.id} className="border rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
              <div className="h-2 bg-blue-500 w-full"></div>
              <div className="p-5 flex-1">
                <h3 className="font-bold text-xl text-[#003366] dark:text-blue-400 mb-2 leading-tight">{evt.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 line-clamp-3">{evt.description}</p>
                
                <div className="space-y-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-5 pt-0 border-t border-dashed dark:border-slate-700 mt-4">
                 <div className="pt-4 flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-500">Your RSVP Status</span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={rsvpStatus === 'GOING' ? 'default' : 'outline'}
                        className={rsvpStatus === 'GOING' ? 'bg-green-600 hover:bg-green-700 flex-1' : 'flex-1'}
                        onClick={() => handleRsvp(evt.id, 'GOING')}
                        disabled={rsvping === evt.id}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Going
                      </Button>
                      <Button 
                        size="sm" 
                        variant={rsvpStatus === 'DECLINED' ? 'destructive' : 'outline'}
                        className="flex-1"
                        onClick={() => handleRsvp(evt.id, 'DECLINED')}
                        disabled={rsvping === evt.id}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Can't Go
                      </Button>
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
        {!loading && events.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed rounded-lg text-muted-foreground bg-slate-50 dark:bg-slate-900">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No upcoming events are scheduled in your division right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
