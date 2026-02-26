"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Gender } from "@/types";
import { saveUser } from "@/libs/storage";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng"),
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  age: z.number().min(18, "Bạn phải từ 18 tuổi trở lên để tham gia"),
  gender: z.enum(["Male", "Female", "LGBT"]),
  bio: z
    .string()
    .min(10, "Bio nên có ít nhất 10 ký tự để người khác hiểu hơn về bạn"),
  address: z.enum(["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Khác"]),
  image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const generateId = () => {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.randomUUID
  ) {
    return window.crypto.randomUUID();
  }
  return new Date().getTime().toString();
};

export default function Home() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: "Male",
      address: "Hồ Chí Minh",
      image: "",
    },
  });
  const imageUrlValue = watch("image");
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Vui lòng chọn ảnh có dung lượng nhỏ hơn 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = (data: ProfileFormValues) => {
    const newUser: User = {
      id: generateId(),
      name: data.name,
      age: data.age,
      gender: data.gender as Gender,
      bio: data.bio,
      email: data.email,
      address: data.address,
      image: data.image,
    };
    saveUser(newUser);
    reset();
    toast.success("Tạo profile thành công!", {
      duration: 3000,
    });
    setTimeout(() => {
      router.push("/explore");
    }, 1000);
  };

  return (
    <main className="flex justify-center items-center bg-gray-100 p-4 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-md">
        <h1 className="mb-6 font-bold text-pink-500 text-3xl text-center">
          Tạo Profile
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Email
            </label>
            <input
              {...register("email")}
              className={`w-full border rounded-lg p-2 outline-none text-gray-900 focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-pink-300"}`}
              placeholder="nhap@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Họ và Tên
            </label>
            <input
              {...register("name")}
              className={`w-full border rounded-lg p-2 outline-none text-gray-900 focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-pink-300"}`}
              placeholder="Nguyễn Văn A"
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Tuổi
              </label>
              <input
                type="number"
                {...register("age", { valueAsNumber: true })}
                className={`w-full border rounded-lg p-2 outline-none text-gray-900 focus:ring-2 ${errors.age ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-pink-300"}`}
                placeholder="18"
              />
              {errors.age && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.age.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Giới tính
              </label>
              <select
                {...register("gender")}
                className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-300 w-full text-gray-900"
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="LGBT">LGBT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Khu vực
            </label>
            <select
              {...register("address")}
              className={`w-full border rounded-lg p-2 outline-none text-gray-900 focus:ring-2 ${errors.address ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-pink-300"}`}
            >
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Khác">Khác</option>
            </select>
            {errors.address && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.address.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Ảnh Đại Diện
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hover:file:bg-pink-100 file:bg-pink-50 file:mr-4 p-2 file:px-4 file:py-2 file:border-0 rounded-lg file:rounded-full outline-none w-full file:font-semibold text-gray-900 file:text-pink-700 file:text-sm file:cursor-pointer"
                />
                <input type="hidden" {...register("image")} />
              </div>

              <div className="relative flex-shrink-0 bg-gray-50 shadow-sm border-2 border-gray-200 rounded-full w-20 h-20 overflow-hidden">
                {imageUrlValue ? (
                  <Image
                    src={imageUrlValue}
                    alt="Preview"
                    fill
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center p-1 w-full h-full text-gray-400 text-xs text-center">
                    Chưa có ảnh
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Bio (Giới thiệu ngắn)
            </label>
            <textarea
              {...register("bio")}
              rows={3}
              className={`w-full border rounded-lg p-2 outline-none text-gray-900 focus:ring-2 ${errors.bio ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-pink-300"}`}
              placeholder="Mô tả một chút về bản thân bạn..."
            />
            {errors.bio && (
              <p className="mt-1 text-red-500 text-xs">{errors.bio.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 py-3 rounded-lg w-full font-bold text-white transition duration-300 cursor-pointer"
          >
            Lưu Profile
          </button>
        </form>
      </div>
    </main>
  );
}
