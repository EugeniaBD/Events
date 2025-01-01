"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import signIn from "@/firebase/auth/signIn";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  email: "",
  password: "",
};

const Schema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required(),
});

type TSchema = Yup.InferType<typeof Schema>;

const Page: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();

  const [submiting, setSubmiting] = React.useState(false);

  const form = useForm<TSchema>({
    defaultValues,
    resolver: yupResolver(Schema),
  });

  const submitHandler = ({ email, password }: TSchema) => {
    setSubmiting(true);
    signIn(email, password)
      .then(({ result, error }) => {
        // console.log(result, error);
        if (error || !result) {
          return;
        }

        const redirectUrl = params.get("redirect-url");
        if (redirectUrl) {
          router.push(redirectUrl, { scroll: true });
          return;
        }
        const { role } = result;
        if (role === "admin") {
          router.push("/admin", { scroll: true });
          return;
        }
        router.push("/", { scroll: true });
      })
      .finally(() => {
        setSubmiting(false);
      });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitHandler)}>
                <div className="grid gap-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="johndoe@mail.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={submiting}>
                    Login
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Register
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
