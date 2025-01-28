import  { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast, ToastContainer } from "react-toastify"
import * as Select from "@radix-ui/react-select"
import * as Label from "@radix-ui/react-label"
import { XCircleIcon } from "@heroicons/react/24/solid"

const formSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, "Max image size is 5MB")
    .optional(),
})

export default function ProductSubmissionForm() {
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      description: "",
    },
  })

  const onSubmit = (values) => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log(values)
      toast.success("Product submitted successfully!")
      setIsSubmitting(false)
      reset()
      setImagePreview(null)
    }, 2000)
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setValue("image", file)
    }
  }

  const handleDeleteImage = () => {
    setImagePreview(null)
    setValue("image", undefined)
    // Reset the file input
    const fileInput = document.getElementById("image")
    if (fileInput) {
      fileInput.value = ""
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mb-4 justify-center items-center  sm:py-12">
     
      <h2 className="text-2xl font-bold mb-6">Submit New Product</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label.Root htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </Label.Root>
          <input
            id="name"
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter product name"
          />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <Label.Root htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </Label.Root>
          <input
            id="price"
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter price"
          />
          {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        <div>
          <Label.Root htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </Label.Root>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select.Root onValueChange={field.onChange} value={field.value}>
                <Select.Trigger className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <Select.Value placeholder="Select a category" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white border border-gray-300 rounded-md shadow-lg">
                    <Select.Viewport>
                      <Select.Item value="electronics" className="px-3 py-2 hover:bg-blue-100 cursor-pointer">
                        <Select.ItemText>Electronics</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="clothing" className="px-3 py-2 hover:bg-blue-100 cursor-pointer">
                        <Select.ItemText>Clothing</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="books" className="px-3 py-2 hover:bg-blue-100 cursor-pointer">
                        <Select.ItemText>Books</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="home" className="px-3 py-2 hover:bg-blue-100 cursor-pointer">
                        <Select.ItemText>Home & Garden</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            )}
          />
          {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div>
          <Label.Root htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </Label.Root>
          <textarea
            id="description"
            {...register("description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Enter product description"
          />
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <Label.Root htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </Label.Root>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-2 text-sm text-gray-500">Upload an image of your product (max 5MB)</p>
          {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>}
        </div>

        {imagePreview && (
          <div className="mt-4 flex items-center">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Product preview"
              className="max-w-full h-auto max-h-64 object-contain"
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
            >
              <XCircleIcon className="h-6 w-6" />
              <span className="sr-only">Delete image</span>
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Product"}
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}

