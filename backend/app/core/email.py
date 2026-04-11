import smtplib
from email.message import EmailMessage
from html import escape

from app.core.config import settings


def send_password_reset_email(to_email: str, reset_url: str, user_name: str | None = None) -> bool:
    subject = "Recupera el acceso a tu cuenta de SIPRO UDC"
    greeting = user_name or "usuario"
    safe_name = escape(greeting)
    expires_in = settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
    text_body = (
        f"Hola {greeting},\n\n"
        "Recibimos una solicitud para restablecer la contraseña de tu cuenta en SIPRO UDC.\n\n"
        "Usa este enlace para crear una nueva contrasena:\n"
        f"{reset_url}\n\n"
        f"Este enlace es de un solo uso y vence en {expires_in} minutos.\n"
        "Si no hiciste esta solicitud, puedes ignorar este correo con tranquilidad.\n\n"
        "Equipo SIPRO UDC"
    )
    html_body = f"""
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recuperacion de contraseña</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Restablece tu contraseña de SIPRO UDC en un enlace seguro y de un solo uso.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.12);">
            <tr>
              <td style="background:linear-gradient(135deg,#6d28d9 0%,#4f46e5 100%);padding:32px 36px;">
                <div style="display:inline-block;background:rgba(255,255,255,0.16);color:#ffffff;padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                  SIPRO UDC
                </div>
                <h1 style="margin:18px 0 10px;color:#ffffff;font-size:30px;line-height:1.2;">
                  Recupera el acceso a tu cuenta
                </h1>
                <p style="margin:0;color:#ede9fe;font-size:16px;line-height:1.7;">
                  Recibimos una solicitud para cambiar tu contraseña. Te guiamos en un paso rapido y seguro.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
                  Hola <strong>{safe_name}</strong>,
                </p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#475569;">
                  Para crear una nueva contraseña, haz clic en el siguiente boton. El enlace es personal, de un solo uso y estara disponible por <strong>{expires_in} minutos</strong>.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
                  <tr>
                    <td align="center" style="border-radius:14px;background:#5b21b6;">
                      <a
                        href="{reset_url}"
                        style="display:inline-block;padding:16px 28px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;border-radius:14px;background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);"
                      >
                        Crear nueva contraseña
                      </a>
                    </td>
                  </tr>
                </table>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:18px 20px;margin:0 0 24px;">
                  <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a;">
                    Que pasara al abrir el enlace
                  </p>
                  <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
                    Se abrira una pagina segura donde podras ingresar tu nueva contrasena y volver a iniciar sesion normalmente.
                  </p>
                </div>
                <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#64748b;">
                  Si el boton no funciona, copia y pega este enlace en tu navegador:
                </p>
                <p style="margin:0 0 28px;word-break:break-all;font-size:13px;line-height:1.8;color:#4f46e5;">
                  <a href="{reset_url}" style="color:#4f46e5;text-decoration:none;">{reset_url}</a>
                </p>
                <p style="margin:0;font-size:13px;line-height:1.8;color:#64748b;">
                  Si no solicitaste este cambio, puedes ignorar este correo. Tu contrasena actual seguira funcionando hasta que completes el proceso.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 36px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0f172a;">
                  Equipo SIPRO UDC
                </p>
                <p style="margin:0;font-size:12px;line-height:1.7;color:#64748b;">
                  Este es un mensaje automatico de recuperacion de acceso.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""

    if not settings.SMTP_HOST:
        print(f"[password-reset] SMTP no configurado. Enlace para {to_email}: {reset_url}")
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    message["To"] = to_email
    message.set_content(text_body)
    message.add_alternative(html_body, subtype="html")

    try:
        if settings.SMTP_USE_SSL:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(message)
        else:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_USE_TLS:
                    server.starttls()
                if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(message)
        return True
    except Exception as exc:
        print(f"[password-reset] No se pudo enviar el correo a {to_email}: {exc}")
        print(f"[password-reset] Enlace de respaldo: {reset_url}")
        return False


def send_login_otp_email(to_email: str, otp_code: str, user_name: str | None = None) -> bool:
    greeting = user_name or "usuario"
    expires_in = settings.OTP_CODE_EXPIRE_MINUTES
    subject = "Codigo de verificacion para iniciar sesion en SIPRO UDC"
    generated_at = settings.FRONTEND_URL.rstrip("/")
    text_body = (
        f"Hola {greeting},\n\n"
        "Recibimos un intento de inicio de sesion en tu cuenta de SIPRO UDC.\n"
        "Usa este codigo OTP para continuar:\n\n"
        f"{otp_code}\n\n"
        f"Este codigo vence en {expires_in} minutos.\n"
        "Solo puede usarse una vez.\n"
        "Si no fuiste tu, cambia tu contrasena inmediatamente.\n"
        f"Puedes ingresar desde: {generated_at}\n\n"
        "Equipo SIPRO UDC"
    )
    html_body = f"""
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Codigo OTP</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:36px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 16px 42px rgba(15,23,42,0.12);">
            <tr>
              <td style="background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);padding:30px 36px;text-align:center;">
                <div style="display:inline-block;background:rgba(255,255,255,0.18);color:#ffffff;padding:7px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                  Seguridad de cuenta
                </div>
                <h1 style="margin:16px 0 8px;color:#ffffff;font-size:30px;line-height:1.2;">Codigo OTP de acceso</h1>
                <p style="margin:0;color:#dbeafe;font-size:15px;line-height:1.6;">
                  Usa este codigo para finalizar tu inicio de sesion en SIPRO UDC.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 36px 30px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.6;text-align:center;">
                  Hola <strong>{escape(greeting)}</strong>,
                </p>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#475569;text-align:center;">
                  Detectamos un intento de inicio de sesion. Ingresa este codigo OTP para continuar.
                </p>
                <div style="margin:0 auto 16px;display:block;width:max-content;padding:13px 24px;border-radius:14px;background:#eff6ff;border:1px solid #bfdbfe;font-size:32px;letter-spacing:8px;font-weight:800;color:#1d4ed8;text-align:center;">
                  {escape(otp_code)}
                </div>
                <div style="margin:0 auto 20px;max-width:460px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:14px 16px;">
                  <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f172a;text-align:center;">Informacion importante</p>
                  <p style="margin:0;font-size:13px;line-height:1.7;color:#475569;text-align:center;">
                    El codigo es de un solo uso y vence en <strong>{expires_in} minutos</strong>. Si no fuiste tu, cambia tu contrasena de inmediato.
                  </p>
                </div>
                <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#64748b;text-align:center;">
                  Plataforma: <a href="{generated_at}" style="color:#1d4ed8;text-decoration:none;">{generated_at}</a>
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;text-align:center;">
                  Equipo SIPRO UDC
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""

    if not settings.SMTP_HOST:
        print(f"[2fa-otp] SMTP no configurado. Codigo OTP para {to_email}: {otp_code}")
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    message["To"] = to_email
    message.set_content(text_body)
    message.add_alternative(html_body, subtype="html")

    try:
        if settings.SMTP_USE_SSL:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(message)
        else:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_USE_TLS:
                    server.starttls()
                if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(message)
        return True
    except Exception as exc:
        print(f"[2fa-otp] No se pudo enviar el codigo OTP a {to_email}: {exc}")
        print(f"[2fa-otp] Codigo OTP de respaldo: {otp_code}")
        return False
