import type { MetaFunction } from "@remix-run/node"
import { useTranslation } from "react-i18next"

import SignInForm from "~/components/auth/sign-in/sign-in-form/sign-in-form"
import DarkModePickerPopover from "~/components/common/dark-mode-picker/dark-mode-picker-popover/dark-mode-picker-popover"
import { action, loader } from "~/domains/auth/controllers/sign-in.server"

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.title },
]

export { loader, action }

export default function SignInPage() {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-full flex-col justify-center">
      <div className="absolute top-[15px] right-[15px]">
        <DarkModePickerPopover />
      </div>
      <div className="mx-auto w-full max-w-md py-4 px-8 rounded-xl border bg-card text-card-foreground shadow">
        <h1 className="w-full text-center text-2xl font-bold">
          {t("Sign in")}
        </h1>
        <SignInForm />
      </div>
    </div>
  )
}
