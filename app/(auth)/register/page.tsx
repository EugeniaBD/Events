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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import signUp from "@/firebase/auth/signup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  role: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Schema = Yup.object().shape({
  role: Yup.string().required(),
  email: Yup.string().required().email(),
  password: Yup.string().required(),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), ""],
    "Password does not match"
  ),
});

type TSchema = Yup.InferType<typeof Schema>;

const Page: React.FC = () => {
  const router = useRouter();

  const [submiting, setSubmiting] = React.useState(false);

  const form = useForm<TSchema>({
    defaultValues,
    resolver: yupResolver(Schema),
  });

  const submitHandler = ({ email, password, role }: TSchema) => {
    setSubmiting(true);

    signUp(email, password, role)
      .then(({ result, error }) => {
        if (error || !result) {
          return;
        }

        if (result.role === "admin") {
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
              Enter your email below to register your new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitHandler)}>
                <div className="grid gap-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Register as</FormLabel>
                        <FormControl>
                          <RadioGroup
                            {...field}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className="grid-flow-col-dense"
                          >
                            <FormItem className="flex items-center space-x-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="user" id="user" />
                              </FormControl>
                              <FormLabel
                                htmlFor="user"
                                className="font-normal m-0"
                              >
                                User
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="admin" id="admin" />
                              </FormControl>
                              <FormLabel
                                htmlFor="admin"
                                className="font-normal"
                              >
                                Admin
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={submiting}>
                    Register
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/signin" className="underline underline-offset-4">
                Sign In
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
