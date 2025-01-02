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
import { create, getById, update } from "@/firebase/firestore/eventsCollection";
import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

const defaultValues = {
  title: "",
  description: "",
  places: 0,
  datetime: "",
};

const Schema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  places: Yup.number().required().min(1),
  datetime: Yup.string().required(),
});

type TSchema = Yup.InferType<typeof Schema>;

const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user } = useFirebaseAuth();

  const [latLng, setLatLng] = React.useState<[number, number]>([0, 0]);
  const [submiting, setSubmiting] = React.useState(false);

  const form = useForm<TSchema>({
    defaultValues,
    resolver: yupResolver(Schema),
  });

  const submitHandler: SubmitHandler<TSchema> = (value) => {
    console.log("submitHandler", value);
    if (!user) {
      return;
    }
    setSubmiting(true);
    let promise = null;
    const { id } = params;
    const event = {
      ...value,
      userId: user?.uid,
      datetime: value.datetime,
      location: "",
    };
    if (id) {
      promise = update({ id, ...event, latLng });
    } else {
      promise = create({ ...event, latLng });
    }
    promise.then(() => router.back()).finally(() => setSubmiting(false));
  };

  const handleInvalid: SubmitErrorHandler<TSchema> = (value) =>
    console.log("handleInvalid", value);

  const handleClose = () => router.back();

  React.useEffect(() => {
    const { id } = params;
    if (!id) {
      return;
    }
    if (!form) {
      return;
    }
    getById(id).then((result) => {
      if (!result) {
        return;
      }
      const { latLng, ...rest } = result;
      setLatLng(latLng);
      form.reset({ ...rest });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, form]);

  return (
    <div className="h-dvh grid grid-cols-2">
      <div className="">
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitHandler, handleInvalid)}>
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
                  <FormField
                    control={form.control}
                    name="places"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Places</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="number of places"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="datetime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
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
      <div className="p-2">{/* <LeafletMap latlng={latLng} /> */}</div>
    </div>
  );
};

export default Page;
