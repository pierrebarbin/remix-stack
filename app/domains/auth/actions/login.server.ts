import { authenticator } from "~/domains/auth/services/auth.server"
import { safeRedirect } from "~/utils"

interface LoginParams {
  email: string
  password: string
  redirectTo?: string | undefined
}

interface LoginContext {
  request: Request
}

export async function login(
  { redirectTo }: LoginParams,
  { request }: LoginContext,
) {
  const user = await authenticator.authenticate("api-proxy", request, {
    throwOnError: true,
  })

  return {
    user,
    redirectTo: safeRedirect(redirectTo),
  }
}
