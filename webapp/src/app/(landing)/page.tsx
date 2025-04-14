import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSupabaseUser } from "@/superbase/hook";
import { createClient } from "@/superbase/server";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserDropDown from "./UserDropDown";

export default async function Home() {
  const server = await createClient();
  const user = await server.auth.getUser();
  return (
    <div>
      <nav className="p-4 flex justify-between items-center container mx-auto">
        <h1 className="font-bold text-xl italic">Easel</h1>
        <div className="flex items-center gap-4">
          <Link href="/boards">
            <Button className="cursor-pointer" variant={"link"}>
              Boards
            </Button>
          </Link>
          {!user.data.user && (
            <ul className="flex space-x-4">
              <li>
                <Link className="cursor-pointer" href="/login">
                  <Button>Login</Button>
                </Link>
              </li>
              <li>
                <Link className="cursor-pointer" href="/register">
                  <Button variant={"outline"}>Register</Button>
                </Link>
              </li>
            </ul>
          )}
          {user.data.user && <UserDropDown />}
        </div>
      </nav>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Collaborate in real-time on a digital whiteboard</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">Brainstorm, plan, and create together with our intuitive whiteboard app. Perfect for teams, educators, and creative minds.</p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="#">
                    Start for free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Watch demo
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[600px] rounded-xl border bg-gradient-to-b from-muted/50 to-muted p-2">
              <Image alt="Whiteboard app interface" className="aspect-video h-full w-full rounded-lg object-cover" height={400} src="/hero.png" width={800} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
