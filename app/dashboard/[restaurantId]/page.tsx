"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Table } from "@/types/table"
import { Restaurant } from "@/types/restaurant"
import { config } from "@/lib/config"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UsersRound, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RestaurantReservationPage({
 params,
 searchParams
}: {
 params: { restaurantId: string }
 searchParams: { callbackUrl?: string}
}) {
 const router = useRouter();
 const { data: session, status } = useSession();
 const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
 const [tables, setTables] = useState<Table[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const handleBack = () => {
  if (searchParams.callbackUrl) {
    router.push(decodeURIComponent(searchParams.callbackUrl));
  } else {
    router.push('/dashboard');
  }
};

 useEffect(() => {
   async function fetchRestaurantAndTables() {
     try {
       if (!session?.accessToken) {
         setError('No session available');
         setLoading(false);
         return;
       }

       const restaurantResponse = await fetch(
         `${config.apiUrl}/restaurants/${params.restaurantId}`,
         {
           headers: {
             'Authorization': `Bearer ${session.accessToken}`,
           },
         }
       );

       if (!restaurantResponse.ok) {
         throw new Error('Failed to fetch restaurant details');
       }

       const restaurantData = await restaurantResponse.json();
       setRestaurant(restaurantData);

       const tablesResponse = await fetch(
         `${config.apiUrl}/tables/${params.restaurantId}`,
         {
           headers: {
             'Authorization': `Bearer ${session.accessToken}`,
           },
         }
       );

       if (!tablesResponse.ok) {
         throw new Error('Failed to fetch tables');
       }

       const tablesData = await tablesResponse.json();
       setTables(tablesData);
     } catch (error) {
       console.error('Error:', error);
       setError('Failed to load restaurant details');
     } finally {
       setLoading(false);
     }
   }

   if (status === "authenticated") {
     fetchRestaurantAndTables();
   }
 }, [params.restaurantId, session, status]);

 if (loading) {
   return (
     <div className="flex min-h-screen items-center justify-center">
       <p>Loading...</p>
     </div>
   );
 }

 if (error || !restaurant) {
   return (
     <div className="flex min-h-screen items-center justify-center">
       <div className="text-center">
         <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
         <p className="text-gray-600 mb-4">{error}</p>
         <Button onClick={() => window.location.reload()}>Try Again</Button>
       </div>
     </div>
   );
 }

 return (
   <div className="flex flex-col min-h-screen">
     <div className="relative h-[200px] w-full">
       {/* <Button
         variant="ghost"
         size="icon"
         className="absolute top-4 left-4 z-10 bg-background/50 hover:bg-background/70 backdrop-blur"
         onClick={() => router.push('/dashboard')}
       >
         <ArrowLeft className="h-5 w-5" />
       </Button> */}
       <Image
         src="/restaurants/restaurant-1.jpg"
         alt={restaurant.name}
         fill
         className="object-cover"
         priority
       />
       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
       <div className="absolute bottom-0 left-0 right-0 p-6">
         <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
         <p className="text-white/90">{restaurant.description}</p>
       </div>
     </div>

     <div className="container mx-auto py-8">
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-semibold">Available Tables</h2>
         <Button 
           variant="outline"
           className="fixed bottom-6 left-6 z-50 rounded-full shadow-lg bg-background hover:shadow-xl transition-shadow"
           onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
           Back
         </Button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {tables.map((table) => (
           <Card 
             key={table.id}
             className="p-6 hover:shadow-lg transition-shadow"
           >
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-2">
                 <UsersRound className="h-5 w-5 text-muted-foreground" />
                 <span className="font-medium">
                   {table.minGuests}-{table.maxGuests} Guests
                 </span>
               </div>
               <Button variant="outline">
                 Select Time
               </Button>
             </div>
             <div className="text-sm text-muted-foreground">
               Table #{table.id.slice(-4)}
             </div>
           </Card>
         ))}
       </div>
     </div>
   </div>
 );
}