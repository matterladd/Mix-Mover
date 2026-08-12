import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Home() {
  const [appleLink, setAppleLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const convertPromise = fetch("/api/spotify/convert-apple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: appleLink }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        console.error(
          `unsuccessful conversion, status ${response.status}, ${data.message}`,
        );
        throw new Error(data.message);
      } else {
        setAppleLink("");
      }
    });

    toast.promise(convertPromise, {
      loading: "Converting...",
      success: "Success! Go to <playlist link> to view playlist",
      error: (err: Error) => err.message,
      position: "top-right",
    });

    try {
      await convertPromise;
      setAppleLink("");
    } catch (err) {
      console.error("unsuccessful conversion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="flex justify-center text-6xl font-bold tracking-tight">
        MixMover
      </h1>
      <h2 className="flex justify-center text-2xl font-semibold tracking-tight">
        Playlist Converter App
      </h2>
      <div className="flex justify-center items-center pt-4">
        <Card className="w-5/6 md:w-fit">
          <form
            className="flex flex-col md:flex-row pl-4 pr-4 justify-center items-center"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="appleLink"
              className="font-semibold text-nowrap pb-2 md:pb-0"
            >
              Apple Music → Spotify:
            </label>
            <div className="md:pr-2 md:pl-2 w-full md:max-w-lg md:w-lg">
              <Input
                id="appleLink"
                className=""
                value={appleLink}
                placeholder="https://music.apple.com/us/playlist/example/abc"
                onChange={(e) => setAppleLink(e.target.value)}
                required
              />
            </div>
            <div className="pt-2 md:pt-0 w-full md:w-fit">
              <Button type="submit" disabled={isLoading} className="w-full">
                convert
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <div className="flex justify-center pt-10 pb-12">
        <Card className="w-5/6 md:max-w-6xl">
          <CardHeader>
            <CardTitle className="flex text-2xl font-bold tracking-tight">
              What is this?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              MixMover is a tool that lets you convert existing music playlists
              on services such as <em className="font-semibold">Apple Music</em>{" "}
              and <em className="font-semibold">Spotify</em> to your favorite
              music streaming service. No more manual copying!
            </p>
          </CardContent>
          <CardHeader>
            <CardTitle className="flex text-2xl font-bold tracking-tight">
              How it works:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside marker:text-xl marker:font-semibold">
              <li>
                <Link to="/signup" className="font-semibold hover:underline">
                  Create a MixMover Account
                </Link>
              </li>
              <li>Connect your external account(s)</li>
              <ul className="list-disc list-inside marker:text-xl marker:font-semibold pl-6 pb-4">
                <li>
                  Go to your{" "}
                  <Link to="/account" className="font-semibold hover:underline">
                    MixMover Account
                  </Link>{" "}
                  and connect the external account(s) you want to save your converted
                  playlists to
                </li>
              </ul>
              <li>Paste the playlist link above and behold!</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
