'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import {useDebounceCallback} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const page = () => {
  const [username ,setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setIsChechingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername,300);
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver : zodResolver(signUpSchema),
    defaultValues : {
      username : '',
      email : '',
      password : ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(username){
        setIsChechingUsername(true)
        setUsernameMessage('')
        try {
         const response = await axios.get(`/api/check-usename-unique?username=${username}`)
         setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        }
        finally {
          setIsChechingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username]);

  const onSubmitt = async (data : z.infer<typeof signUpSchema>) => {

    setIsSubmitting(true)
    try {

      const response = await axios.post<ApiResponse>('/api/sign-up',data)

      toast({
        title : 'Success',
        description : response.data.message
      })
      router.replace(`/verify${username}`)
      setIsSubmitting(false)

    } catch (error) {
      console.log("Error in signup of user",error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessgae = axiosError.response?.data.message
      toast({
        title : "Signup failed",
        description : errorMessgae,
        variant : "destructive"
      })
      setIsSubmitting(false)
    }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shodow-md">
        <div className="text-center">
           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
           <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitt)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                    }} />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className ="animate-spin"/>}
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500": "text-red-500"}`}>
                    text {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field}  />
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
                     type="password"
                    placeholder="Password" {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                  </>
                ) : ('Signup')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{''}
            <Link href = "/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page