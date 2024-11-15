/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
"use client";
import { z } from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OTPModel from "@/components/OTPModel";

type FormType = "sign-in" | "sign-up";

// Function to generate schema based on the form type
const authFormSchema = (formType: FormType) =>
  z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });

const AuthForm = ({ type }: { type: FormType }) => {
  // Define the schema inside the component to use the `type` prop
  const formSchema = authFormSchema(type);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [accountId, setAccountId] = React.useState(null);
  // Initialize the form with the dynamic schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user =
        type === "sign-up"
          ? await createAccount({
              fullName: values.fullName || "",
              email: values.email,
            })
          : await signInUser({ email: values.email });
      setAccountId(user.accountId);
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className={"form-title"}>
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className={`shad-form-item`}>
                    <FormLabel className={`shad-form-label`}>
                      Full Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter Your full name"
                        className={`shad-input`}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className={`shad-form-message`} />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className={`shad-form-item`}>
                  <FormLabel className={`shad-form-label`}>Email</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter Your email"
                      className={`shad-input`}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className={`shad-form-message`} />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className={`form-submit-button`}
          >
            {type === "sign-in" ? "sign-in" : "sign-up"}
            {isLoading && (
              <Image
                src={`/assets/icons/loader.svg`}
                alt={`loader`}
                width={24}
                height={24}
                className={`ml-2 animate-spin`}
              />
            )}
          </Button>
          {errorMessage && <p>*{errorMessage}</p>}

          <div className={`body-2 flex justify-center`}>
            <p className={`text-light-100`}>
              {type === "sign-in"
                ? "Don't have an Account?"
                : "Already have an Account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className={`ml-1 font-medium text-brand`}
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>
      {accountId && (
        <OTPModel email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
