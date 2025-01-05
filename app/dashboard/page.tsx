"use client"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Restaurant } from "@/types/restaurant"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { config } from "@/lib/config"
import { RestaurantFilter } from "@/app/dashboard/components/restaurant-filter"
import { useDebounce } from "@/hooks/use-debounce"

const restaurantImages = [
  {
    src: "/restaurants/restaurant-1.jpg",
    alt: "Modern Restaurant Interior",
  },
  {
    src: "/restaurants/restaurant-2.jpg",
    alt: "Fine Dining Setup",
  },
  {
    src: "/restaurants/restaurant-3.jpg",
    alt: "Romantic Restaurant",
  },
  {
    src: "/restaurants/restaurant-4.jpg",
    alt: "Cozy Bistro",
  },
  {
    src: "/restaurants/restaurant-5.jpg",
    alt: "Modern Dining",
  },
];

const bannerImage = {
  src: "/banner.jpg",
  alt: "Restaurant Banner"
};

function getRandomRestaurantImage() {
  return restaurantImages[Math.floor(Math.random() * restaurantImages.length)];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurantImageMap] = useState<Map<string, typeof restaurantImages[0]>>(new Map());
  
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500); 
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (restaurants.length > 0) {
      restaurants.forEach(restaurant => {
        if (!restaurantImageMap.has(restaurant.name)) {
          restaurantImageMap.set(restaurant.name, getRandomRestaurantImage());
        }
      });
    }
  }, [restaurants, restaurantImageMap]);

  async function fetchRestaurants() {
    try {
      if (!session?.accessToken) {
        setError('No session available');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (selectedTypes.length > 0) {
        params.append('type', selectedTypes.join(','));
      }
      if (sortOrder) {
        params.append('sort', sortOrder);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(
        `${config.apiUrl}/restaurants/filter?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRestaurants(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchRestaurants();
    }
  }, [status, debouncedSearch, selectedTypes, sortOrder]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
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
    <div className="flex min-h-screen flex-col space-y-6 p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search restaurants..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <RestaurantFilter
            selectedTypes={selectedTypes}
            onTypeChange={setSelectedTypes}
          />
          <Button 
            variant="outline"
            onClick={handleSort}
          >
            Sort {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
        <Image
          src={bannerImage.src}
          alt={bannerImage.alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Discover Restaurants</h2>
          <p className="text-lg">Find and book your perfect dining experience</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant, index) => {
          const image = restaurantImageMap.get(restaurant.name) || restaurantImages[0];
          return (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={image.src}
                  alt={`${restaurant.name} - ${image.alt}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{restaurant.description}</p>
                <div className="flex gap-2 mt-2">
                  {restaurant.cuisineType.map((cuisine, idx) => (
                    <span
                      key={idx}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Location: {restaurant.location.coordinates.join(', ')}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Make Reservation</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}