"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

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
  const [icons, setIcons] = useState(null);
  const [wasteSpots, setWasteSpots] = useState([
    { id: 1, coords: [30.7281, 79.6059], description: "10 plastic bottles near Valley of Flowers", status: "dirty" },
    { id: 2, coords: [30.7290, 79.6065], description: "5 wrappers near campsite", status: "cleaned" },
    { id: 3, coords: [30.7275, 79.6040], description: "20 kg trash near Roopkund", status: "dirty" },
  ]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [points, setPoints] = useState(() => {
    return typeof window !== "undefined" ? parseInt(localStorage.getItem("points") || "15") : 15;
  });
  const [cleanups, setCleanups] = useState(() => {
    return typeof window !== "undefined" ? parseInt(localStorage.getItem("cleanups") || "2") : 2;
  });

  // Dummy leaderboard data (Priya’s points sync with local storage)
  const [leaderboardPreview, setLeaderboardPreview] = useState(() => [
    { rank: 1, name: "Priya Sharma", points: parseInt(localStorage.getItem("points") || "15"), cleanups: parseInt(localStorage.getItem("cleanups") || "2") },
    { rank: 2, name: "Aman Rawat", points: 120, cleanups: 10 },
    { rank: 3, name: "Riya Bisht", points: 95, cleanups: 8 },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
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

  // Sync points, cleanups, and leaderboard to local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("points", points.toString());
      localStorage.setItem("cleanups", cleanups.toString());
      setLeaderboardPreview((prev) =>
        prev.map((leader) =>
          leader.rank === 1 ? { ...leader, points, cleanups } : leader
        )
      );
    }
  }, [points, cleanups]);

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

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot);
  };

  if (!icons) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-[#1A3C34] text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/favicon.ico" alt="HaritHimalaya Logo" width={40} height={40} className="rounded-full" />
            <span className="text-2xl font-bold">HaritHimalaya</span>
          </div>
          <div className="flex space-x-6 items-center">
            <Link href="/" className="hover:text-[#A3BFFA] transition duration-300">Home</Link>
            <Link href="/leaderboard" className="hover:text-[#A3BFFA] transition duration-300">Leaderboard</Link>
            <Link href="/dashboard" className="hover:text-[#A3BFFA] transition duration-300">Dashboard</Link>
            <Link href="/about" className="hover:text-[#A3BFFA] transition duration-300">About</Link>
            <button
              onClick={handleLogWaste}
              className="bg-[#2F855A] px-4 py-2 rounded-md hover:bg-[#276749] transition duration-300 transform hover:scale-105"
            >
              Log Waste
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#2F855A] text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Restore Uttarakhand’s Green Glory
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-200">
            Track waste, clean trails, and turn trash into treasure with HaritHimalaya!
          </p>
          <Link
            href="/dashboard"
            className="bg-[#1A3C34] text-white px-6 py-3 rounded-lg hover:bg-[#16332D] transition duration-300 transform hover:scale-105 inline-block"
          >
            Join the Cleanup
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2F855A]/50 to-[#1A3C34]/50 animate-pulse opacity-30"></div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-[#1A3C34] text-center mb-8">Why HaritHimalaya?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-[#2F855A] mb-2">Log & Track</h3>
            <p className="text-gray-700">
              Pin waste spots on trails like Valley of Flowers—watch them go green as we clean!
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-[#2F855A] mb-2">Earn Points</h3>
            <p className="text-gray-700">
              Collect “Clean Mountain” points—top the leaderboard or redeem trek perks!
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-[#2F855A] mb-2">Recycle & Revenue</h3>
            <p className="text-gray-700">
              Drop waste at hubs—see it turn into rPET flakes and fund sustainability!
            </p>
          </div>
        </div>
      </section>

      {/* Map Section with Points */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-[#1A3C34] text-center mb-8">Cleanup in Action</h2>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700">
              Your Clean Mountain Points: <span className="font-bold text-[#2F855A] text-2xl">{points}</span>
            </p>
          </div>
          <MapContainer
            center={[30.7281, 79.6059]}
            zoom={12}
            style={{ height: "400px", width: "100%" }}
            className="rounded-md"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
          <div className="mt-4 text-center space-y-2">
            <p className="text-gray-700">
              Selected Spot: <span className="font-semibold text-[#2F855A]">{selectedSpot ? `${selectedSpot.description} (${selectedSpot.status})` : "None"}</span>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogWaste}
                className="bg-[#2F855A] text-white px-6 py-2 rounded-md hover:bg-[#276749] transition duration-300 transform hover:scale-105"
              >
                Log New Waste Spot (+5)
              </button>
              <button
                onClick={handleCleanWaste}
                className="bg-[#1A3C34] text-white px-6 py-2 rounded-md hover:bg-[#16332D] transition duration-300 transform hover:scale-105"
              >
                Clean Waste Spot (+10)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview Section */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-[#1A3C34] text-center mb-8">Top Cleaners Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaderboardPreview.slice(0, 3).map((leader) => (
            <div
              key={leader.rank}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 text-center"
            >
              <p className="text-2xl font-bold text-[#2F855A] mb-2">
                {leader.rank === 1 ? "🥇" : leader.rank === 2 ? "🥈" : "🥉"} #{leader.rank}
              </p>
              <p className="text-lg font-semibold text-gray-700">{leader.name}</p>
              <p className="text-gray-600">Points: <span className="text-[#2F855A] font-bold">{leader.points}</span></p>
              <p className="text-gray-600">Cleanups: <span className="text-[#2F855A] font-bold">{leader.cleanups}</span></p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            href="/leaderboard"
            className="bg-[#2F855A] text-white px-6 py-2 rounded-md hover:bg-[#276749] transition duration-300 inline-block"
          >
            View Full Leaderboard
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#1A3C34] text-white py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-lg text-gray-200 mb-6">
          Join trekkers, locals, and eco-warriors to save Uttarakhand’s trails!
        </p>
        <Link
          href="/dashboard"
          className="bg-[#2F855A] px-6 py-3 rounded-lg hover:bg-[#276749] transition duration-300 inline-block"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A3C34] text-white py-6 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Image src="/favicon.ico" alt="HaritHimalaya Logo" width={30} height={30} className="rounded-full" />
            <span className="text-lg font-bold">HaritHimalaya</span>
          </div>
          <p className="text-gray-200">Built with ❤️ for Uttarakhand’s mountains by Team Hackathon</p>
          <p className="text-sm mt-2">© 2025 HaritHimalaya</p>
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
      `}</style>
    </div>
  );
}