"use client";
import { signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
const RegisterPage = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Registering...");
        // Get form data
        const formData = new FormData(e.currentTarget);
        signUpAction(formData).then((res) => {
          if (res) {
            console.log("Registration successful");
          } else {
            console.log("Registration failed");
          }
        });
      }}
    >
      <Card className="bg-background max-w-xl mx-auto">
        <CardHeader>
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-sm text-muted-foreground">Please register to your account</p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="input-group">
            <Label>Name</Label>
            <Input name="name" type="text" placeholder="Enter your name" />
          </div>
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
          <Button className="w-full mt-4">Register</Button>
          <div className="flex justify-between mt-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default RegisterPage;
