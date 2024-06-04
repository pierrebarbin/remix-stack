import { FormProvider, getFormProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"

import FieldEmail from "~/components/auth/sign-in/sign-in-form/field/field-email/field-email"
import FieldPassword from "~/components/auth/sign-in/sign-in-form/field/field-password/field-password"
import Errors from "~/components/common/form/errors/errors"
import { Button } from "~/components/common/ui/button"
import { schema } from "~/domains/auth/schemas/sign-in"
import { action } from "~/routes/sign-in"
import { getInputProps } from "~/utils/form"

export default function SignInForm() {
  const lastResult = useActionData<typeof action>()

  const [searchParams] = useSearchParams()

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onSubmit",
    defaultValue: {
      email: "",
      password: "",
      redirectTo: searchParams.get("redirectTo") ?? undefined,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })

  const { t } = useTranslation()
  const navigation = useNavigation()

  const isSubmitting =
    navigation.state === "submitting" ||
    (navigation.state === "loading" && navigation.formMethod === "POST")

  return (
    <Form method="post" className="space-y-6" {...getFormProps(form)}>
      <FormProvider context={form.context}>
        <AuthenticityTokenInput />

        <input {...getInputProps(fields.redirectTo, { type: "hidden" })} />

        <FieldEmail name={fields.email.name} />

        <FieldPassword name={fields.password.name} />

        {form.errors ? (
          <Errors>{form.errors.map((error) => error)}</Errors>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {t("Sign in")}
          {isSubmitting ? "..." : ""}
        </Button>

        <div className="w-full text-center text-sm text-gray-500">
          {t("Don't have an account?")}{" "}
          <Button className="px-0" variant="link" asChild>
            <Link
              to={{
                pathname: "/sign-up",
                search: searchParams.toString(),
              }}
            >
              {t("Sign up")}
            </Link>
          </Button>
        </div>
      </FormProvider>
    </Form>
  )
}
