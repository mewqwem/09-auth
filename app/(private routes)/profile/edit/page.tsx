"use client";
import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { updateMe } from "@/lib/api/clientApi";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const username = formData.get("username") as string;
    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch {
      toast("Somethings went wrong! Please try again later.");
    }
  };

  return (
    <div>
      {user && (
        <main className={css.mainContent}>
          <div className={css.profileCard}>
            <h1 className={css.formTitle}>Edit Profile</h1>

            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />

            <form action={handleSubmit} className={css.profileInfo}>
              <div className={css.usernameWrapper}>
                <label htmlFor="username">Username: {user.username}</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={css.input}
                  defaultValue={user.username}
                />
              </div>

              <p>Email: {user.email}</p>

              <div className={css.actions}>
                <button type="submit" className={css.saveButton}>
                  Save
                </button>
                <button
                  onClick={() => router.back()}
                  type="button"
                  className={css.cancelButton}
                >
                  Cancel
                </button>
                <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={true}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                  transition={Bounce}
                />
              </div>
            </form>
          </div>
        </main>
      )}
    </div>
  );
}

export default EditPage;
