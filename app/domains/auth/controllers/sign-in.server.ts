import { parseWithZod } from "@conform-to/zod"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { typedjson } from "remix-typedjson"

import { login } from "~/domains/auth/actions/login.server"
import { schema } from "~/domains/auth/schemas/sign-in"
import {
  createUserSession,
  getUser,
} from "~/domains/auth/services/session.server"
import i18next from "~/i18next.server"
import { validateCsrf } from "~/utils/csrf.server"
import { getProperError } from "~/utils/error"

import { authenticator } from "../services/auth.server"

export async function action({ request }: ActionFunctionArgs) {
  await validateCsrf(request)

  const formData = await request.clone().formData()

  const submission = parseWithZod(formData, { schema })

  if (submission.status !== "success") {
    return submission.reply()
  }

  const result = await login({ ...submission.payload }, { request })

  if (!result.success) {
    return typedjson(
      {
        ...submission.reply({
          formErrors: [(await getProperError(result, request)).error],
        }),
      },
      400,
    )
  }

  return createUserSession({
    defaultRedirectTo: result.data.redirectTo,
    remember: true,
    sessionKey: authenticator.sessionKey,
    request,
    user: result.data.user,
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  if (user) {
    return redirect("/")
  }

  const t = await i18next.getFixedT(request)
  const title = t("Sign in")

  return typedjson({ title })
}
