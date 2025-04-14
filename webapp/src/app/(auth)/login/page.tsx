"use client";

import { signInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
const LoginPage = () => {
  const searchParams = useSearchParams();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // console.log("Logging in...");
        // Get form data
        const formData = new FormData(e.currentTarget);
        // Call signInAction with form data
        signInAction(formData).then((res) => {
          if (res) {
            console.log("Login successful");
          } else {
            console.log("Login failed");
          }
        });
      }}
    >
      <Card className="bg-background max-w-xl mx-auto">
        <CardHeader>
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Please login to your account</p>
            <p>{searchParams.get("error")}</p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="input-group">
            <Label>Email</Label>
            <Input name="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <Label>Password</Label>
            <Input name="password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="grid">
          <Button className="w-full mt-4">Login</Button>
          <div className="flex justify-between mt-4">
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Forgot Password?
            </a>
            <Link href="/register" className="text-sm text-muted-foreground hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginPage;
