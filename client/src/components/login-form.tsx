import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/context/auth/index";
import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useSpotifyContext } from "@/context/spotify/index"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // TODO: probably unsafe storing this as a state?
  // const [isLoggedIn, setIsLoggedIn] = (true); // set for first time display
  const { setUser } = useAuthContext();
  const { updateSpotifyUser } = useSpotifyContext();

  // declared inside LoginForm component because it needs access to component state
  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault(); // stops the default form submit behavior (sending http)

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // tells browser to send/receive cookies
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
        console.error(data.error);
        // setIsLoggedIn(false);
    } else {
        setUser({id: data.id, email: data.email});
        updateSpotifyUser();
        navigate('/');
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
