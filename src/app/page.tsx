"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Map Component to stabilize Leaflet instance
const MapComponent = ({ wasteSpots, selectedSpot, handleMarkerClick, icons }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Clean up map instance on unmount
      }
    };
  }, []);

  return (
    <MapContainer
      center={[30.7281, 79.6059]}
      zoom={12}
      style={{ height: "300px", width: "100%" }}
      className="rounded-md"
      zoomControl={true}
      whenCreated={(map) => (mapRef.current = map)} // Store map instance
    >
      <TileLayer
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
        maxZoom={17}
      />
      {wasteSpots.map((spot) => (
        <Marker
          key={spot.id}
          position={spot.coords}
          icon={spot.status === "dirty" ? icons.redIcon : icons.greenIcon}
          eventHandlers={{ click: () => handleMarkerClick(spot) }}
        >
          <Popup>{spot.description} - {spot.status}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const initializeIcons = () => {
  const L = require("leaflet");
  return {
    redIcon: new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
      shadowSize: [41, 41],
    }),
    greenIcon: new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
      shadowSize: [41, 41],
    }),
  };
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [icons, setIcons] = useState(null);
  const [wasteSpots, setWasteSpots] = useState([
    { id: 1, coords: [30.7281, 79.6059], description: "10 plastic bottles near Valley of Flowers", status: "dirty" },
    { id: 2, coords: [30.7290, 79.6065], description: "5 wrappers near campsite", status: "cleaned" },
    { id: 3, coords: [30.7275, 79.6040], description: "20 kg trash near Roopkund", status: "dirty" },
  ]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [points, setPoints] = useState(15);
  const [cleanups, setCleanups] = useState(2);

  const [leaderboard, setLeaderboard] = useState([
    { name: "Priya Sharma", points: 15, cleanups: 2 },
    { name: "Aman Rawat", points: 120, cleanups: 10 },
    { name: "Riya Bisht", points: 95, cleanups: 8 },
    { name: "Vikram Singh", points: 80, cleanups: 6 },
    { name: "Sneha Negi", points: 65, cleanups: 5 },
  ]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const storedPoints = parseInt(localStorage.getItem("points") || "15");
      const storedCleanups = parseInt(localStorage.getItem("cleanups") || "2");
      setPoints(storedPoints);
      setCleanups(storedCleanups);

      setLeaderboard((prev) =>
        prev.map((leader) =>
          leader.name === "Priya Sharma" ? { ...leader, points: storedPoints, cleanups: storedCleanups } : leader
        ).sort((a, b) => b.points - a.points)
        .map((leader, index) => ({ ...leader, rank: index + 1 }))
      );

      const { redIcon, greenIcon } = initializeIcons();
      setIcons({ redIcon, greenIcon });

      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
      });
    }
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      localStorage.setItem("points", points.toString());
      localStorage.setItem("cleanups", cleanups.toString());
      const updatedLeaderboard = leaderboard
        .map((leader) =>
          leader.name === "Priya Sharma" ? { ...leader, points, cleanups } : leader
        )
        .sort((a, b) => b.points - a.points)
        .map((leader, index) => ({ ...leader, rank: index + 1 }));
      setLeaderboard(updatedLeaderboard);
    }
  }, [points, cleanups, isMounted]);

  const handleLogWaste = () => {
    const newId = wasteSpots.length + 1;
    const randomOffsetLat = (Math.random() - 0.5) * 0.005;
    const randomOffsetLng = (Math.random() - 0.5) * 0.005;
    const newSpot = {
      id: newId,
      coords: [30.7281 + randomOffsetLat, 79.6059 + randomOffsetLng],
      description: `New waste spot #${newId} - Plastic debris`,
      status: "dirty",
    };
    setWasteSpots([...wasteSpots, newSpot]);
    setPoints(points + 5);
    alert("Waste logged! +5 points earned—check the map and Dashboard!");
  };

  const handleCleanWaste = () => {
    if (!selectedSpot) {
      alert("Please select a waste spot to clean by clicking its marker!");
      return;
    }
    if (selectedSpot.status === "cleaned") {
      alert("This spot is already cleaned!");
      return;
    }
    const updatedSpots = wasteSpots.map((spot) =>
      spot.id === selectedSpot.id ? { ...spot, status: "cleaned" } : spot
    );
    setWasteSpots(updatedSpots);
    setSelectedSpot({ ...selectedSpot, status: "cleaned" });
    setPoints(points + 10);
    setCleanups(cleanups + 1);
    alert("Spot cleaned! +10 points earned—check your Dashboard!");
  };

  const handleReset = () => {
    setPoints(15);
    setCleanups(2);
    setWasteSpots([
      { id: 1, coords: [30.7281, 79.6059], description: "10 plastic bottles near Valley of Flowers", status: "dirty" },
      { id: 2, coords: [30.7290, 79.6065], description: "5 wrappers near campsite", status: "cleaned" },
      { id: 3, coords: [30.7275, 79.6040], description: "20 kg trash near Roopkund", status: "dirty" },
    ]);
    setSelectedSpot(null);
    if (typeof window !== "undefined") {
      localStorage.setItem("points", "15");
      localStorage.setItem("cleanups", "2");
    }
    alert("Reset complete! Points and cleanups back to default.");
  };

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
  };

  if (!isMounted || !icons) {
    return <div className="h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-[#1A3C34] text-white px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
          <div className="flex items-center space-x-2">
            <Image src="/favicon.ico" alt="HaritHimalaya Logo" width={36} height={36} className="rounded-full" />
            <span className="text-xl md:text-2xl font-bold">HaritHimalaya</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-sm md:text-base">
            <Link href="/" className="hover:text-[#A3BFFA] transition duration-300">Home</Link>
            <Link href="/leaderboard" className="hover:text-[#A3BFFA] transition duration-300">Leaderboard</Link>
            <Link href="/dashboard" className="hover:text-[#A3BFFA] transition duration-300">Dashboard</Link>
            <Link href="/about" className="hover:text-[#A3BFFA] transition duration-300">About</Link>
            <button
              onClick={handleLogWaste}
              className="bg-[#2F855A] px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-[#276749] transition duration-300 transform hover:scale-105"
            >
              Log Waste
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#2F855A] text-white py-12 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            Restore Uttarakhand’s Green Glory
          </h1>
          <p className="text-sm md:text-lg lg:text-xl mb-6 text-gray-200">
            Track waste, clean trails, and turn trash into treasure with HaritHimalaya!
          </p>
          <Link
            href="/dashboard"
            className="bg-[#1A3C34] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-[#16332D] transition duration-300 transform hover:scale-105 inline-block"
          >
            Join the Cleanup
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2F855A]/50 to-[#1A3C34]/50 animate-pulse opacity-30"></div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A3C34] text-center mb-6">Why HaritHimalaya?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h3 className="text-lg md:text-xl font-semibold text-[#2F855A] mb-2">Log & Track</h3>
            <p className="text-gray-700 text-sm md:text-base">
              Pin waste spots on trails like Valley of Flowers—watch them go green as we clean!
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h3 className="text-lg md:text-xl font-semibold text-[#2F855A] mb-2">Earn Points</h3>
            <p className="text-gray-700 text-sm md:text-base">
              Collect “Clean Mountain” points—top the leaderboard or redeem trek perks!
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h3 className="text-lg md:text-xl font-semibold text-[#2F855A] mb-2">Recycle & Revenue</h3>
            <p className="text-gray-700 text-sm md:text-base">
              Drop waste at hubs—see it turn into rPET flakes and fund sustainability!
            </p>
          </div>
        </div>
      </section>

      {/* Map Section with Points and Legend */}
      <section className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A3C34] text-center mb-6">Cleanup in Action</h2>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center mb-4">
            <p className="text-sm md:text-lg text-gray-700">
              Your Clean Mountain Points: <span className="font-bold text-[#2F855A] text-lg md:text-2xl">{points}</span>
            </p>
          </div>
          <MapComponent
            wasteSpots={wasteSpots}
            selectedSpot={selectedSpot}
            handleMarkerClick={handleMarkerClick}
            icons={icons}
          />
          <div className="mt-4 text-center space-y-2">
            <p className="text-gray-700 text-sm md:text-base">
              Selected Spot: <span className="font-semibold text-[#2F855A]">{selectedSpot ? `${selectedSpot.description} (${selectedSpot.status})` : "None"}</span>
            </p>
            <div className="flex justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-700">
              <p><span className="inline-block w-2 h-2 md:w-3 md:h-3 bg-red-500 mr-1"></span> Dirty</p>
              <p><span className="inline-block w-2 h-2 md:w-3 md:h-3 bg-green-500 mr-1"></span> Cleaned</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-4">
              <button
                onClick={handleLogWaste}
                className="bg-[#2F855A] text-white px-4 py-2 rounded-md hover:bg-[#276749] transition duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Log New Waste Spot (+5)
              </button>
              <button
                onClick={handleCleanWaste}
                className="bg-[#1A3C34] text-white px-4 py-2 rounded-md hover:bg-[#16332D] transition duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Clean Waste Spot (+10)
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview Section */}
      <section className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A3C34] text-center mb-6">Top Cleaners Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {leaderboard.slice(0, 3).map((leader) => (
            <div
              key={leader.rank}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 text-center"
            >
              <p className="text-xl md:text-2xl font-bold text-[#2F855A] mb-2">
                {leader.rank === 1 ? "🥇" : leader.rank === 2 ? "🥈" : "🥉"} #{leader.rank}
              </p>
              <p className="text-sm md:text-lg font-semibold text-gray-700">{leader.name}</p>
              <p className="text-gray-600 text-xs md:text-base">Points: <span className="text-[#2F855A] font-bold">{leader.points}</span></p>
              <p className="text-gray-600 text-xs md:text-base">Cleanups: <span className="text-[#2F855A] font-bold">{leader.cleanups}</span></p>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link
            href="/leaderboard"
            className="bg-[#2F855A] text-white px-4 py-2 rounded-md hover:bg-[#276749] transition duration-300 inline-block text-sm md:text-base"
          >
            View Full Leaderboard
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#1A3C34] text-white py-8 px-4 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-sm md:text-lg text-gray-200 mb-4">
          Join trekkers, locals, and eco-warriors to save Uttarakhand’s trails!
        </p>
        <Link
          href="/dashboard"
          className="bg-[#2F855A] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-[#276749] transition duration-300 inline-block text-sm md:text-base"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A3C34] text-white py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Image src="/favicon.ico" alt="HaritHimalaya Logo" width={24} height={24} className="rounded-full" />
            <span className="text-sm md:text-lg font-bold">HaritHimalaya</span>
          </div>
          <p className="text-gray-200 text-xs md:text-sm">Built with ❤️ for Uttarakhand’s mountains by Team Hackathon</p>
          <p className="text-xs mt-2">© 2025 HaritHimalaya</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .leaflet-control-zoom a {
          background-color: #2F855A !important;
          color: white !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #276749 !important;
        }
      `}</style>
    </div>
  );
}