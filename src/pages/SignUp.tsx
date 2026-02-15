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
import { useRegistration } from "@/hooks/auth";
import { signupSchema, type TSignUpData } from "@/schema/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm<TSignUpData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", name: "", password: "" },
  });

  const { mutate: signUp, isPending } = useRegistration();

  const showPassword = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const onSubmit = (values: TSignUpData) => {
    signUp(values);
    form.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl w-full sm:w-96 p-6 transition-all hover:shadow-2xl">
        <h1 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
          Create an Account
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      {...field}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible ? "text" : "password"}
                        placeholder="********"
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={showPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-2 rounded-md text-lg font-medium transition-all"
            >
              {isPending ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
