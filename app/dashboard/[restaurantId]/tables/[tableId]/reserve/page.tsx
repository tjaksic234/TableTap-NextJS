"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { format, addHours } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Users, ArrowLeft } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { config } from "@/lib/config"

const START_TIME_SLOTS = [
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
]

interface ReservationPageProps {
  params: { 
    restaurantId: string
    tableId: string 
  }
  searchParams: { 
    minGuests: string
    maxGuests: string
    callbackUrl?: string
  }
}

export default function ReservationPage({ params, searchParams }: ReservationPageProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [date, setDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>()
  const [duration, setDuration] = useState("2")
  const [guests, setGuests] = useState(parseInt(searchParams.minGuests))
  const [email, setEmail] = useState(session?.user?.email || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!date || !startTime || !email) return

    setIsSubmitting(true)
    try {
      const [hours, minutes] = startTime.split(':')
      const startDateTime = new Date(date)
      startDateTime.setHours(parseInt(hours), parseInt(minutes))
      const endDateTime = addHours(startDateTime, parseInt(duration))

      const response = await fetch(`${config.apiUrl}/reservations/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          email,
          restaurantID: params.restaurantId,
          tableID: params.tableId,
          numOfGuests: guests,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create reservation')
      }

      toast({
        title: 'Reservation Confirmed',
        description: 'Your reservation has been successfully created.',
        className: "bg-green-100 border-green-400",
        duration: 3000,
      })

      // Redirect back after successful reservation
      if (searchParams.callbackUrl) {
        router.push(decodeURIComponent(searchParams.callbackUrl))
      } else {
        router.push('/dashboard')
      }

    } catch (error) {
      console.error('Error creating reservation:', error)
      toast({
        title: 'Error',
        description: 'Failed to create reservation. Please try again.',
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (searchParams.callbackUrl) {
      router.push(decodeURIComponent(searchParams.callbackUrl))
    } else {
      router.push('/dashboard')
    }
  }

  // Generate array of possible guest numbers between min and max
  const guestOptions = Array.from(
    { length: parseInt(searchParams.maxGuests) - parseInt(searchParams.minGuests) + 1 },
    (_, i) => parseInt(searchParams.minGuests) + i
  )

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Button 
        variant="outline"
        className="mb-6"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Make a Reservation</CardTitle>
          <CardDescription>
            Book your table by selecting your preferred date, time, and number of guests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Confirmation Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email for confirmation"
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date < new Date() ||
                    date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Start Time</Label>
            <Select onValueChange={setStartTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select start time">
                  <Clock className="mr-2 h-4 w-4" />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {START_TIME_SLOTS.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Number of Guests</Label>
            <Select 
              value={guests.toString()} 
              onValueChange={(value) => setGuests(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue>
                  <Users className="mr-2 h-4 w-4" />
                  {guests} {guests === 1 ? 'Guest' : 'Guests'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {guestOptions.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={!date || !startTime || !email || isSubmitting}
          >
            {isSubmitting ? "Creating Reservation..." : "Confirm Reservation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}