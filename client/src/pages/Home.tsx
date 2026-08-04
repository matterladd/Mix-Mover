import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function Home() {
  const [appleLink, setAppleLink] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setisLoading(true);
    const response = await fetch("/api/spotify/convert-apple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: appleLink }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error(
        `unsuccessful conversion, status ${response.status}, ${data.message}`,
      );
      toast.error("Unsuccessful", {
        position: "top-right",
        action: {
          label: "x",
          onClick: () => {},
        },
      });
    } else {
      toast.success("Success!", {
        position: "top-right",
        action: {
          label: "x",
          onClick: () => {},
        },
      });
    }
    setisLoading(false);
  };

  return (
    <>
      <h1 className="flex justify-center text-6xl font-bold tracking-tight">
        MixMover
      </h1>
      <form
        className="flex flex-col md:flex-row p-8 justify-center items-center"
        onSubmit={handleSubmit}
      >
        <label htmlFor="appleLink" className="text-nowrap">
          Apple Music Playlist link:
        </label>
        <div className="md:pr-2 md:pl-2 max-w-md md:max-w-lg md:w-lg">
          <Input
            id="appleLink"
            className=""
            value={appleLink}
            onChange={(e) => setAppleLink(e.target.value)}
            required
          />
        </div>
        <div className="pt-2 md:pt-0">
          <Button type="submit" disabled={isLoading} className="">
            convert
            {isLoading && <Spinner data-icon="inline-start" />}
          </Button>
        </div>
      </form>
    </>
  );
}
