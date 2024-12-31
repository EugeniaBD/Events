"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { create } from "@/firebase/firestore/clubsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  title: "",
  description: "",
};

const Schema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
});

type TSchema = Yup.InferType<typeof Schema>;

const Page: React.FC = () => {
  const router = useRouter();
  const { user } = useFirebaseAuth();

  const [submiting, setSubmiting] = React.useState(false);

  const form = useForm<TSchema>({
    defaultValues,
    resolver: yupResolver(Schema),
  });

  const submitHandler = React.useCallback(
    (value: TSchema) => {
      if (user) {
        setSubmiting(true);
        create({ ...value, userId: user?.uid })
          .then(() => router.back())
          .finally(() => setSubmiting(false));
      }
    },
    [user]
  );

  const handleClose = () => router.back();

  return (
    <div className="flex min-h-svh w-full">
      <div className="w-full max-w-full md:max-w-md ">
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitHandler)}>
                <div className="grid gap-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      disabled={submiting}
                    >
                      Close
                    </Button>
                    <Button type="submit" className="" disabled={submiting}>
                      Create
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
