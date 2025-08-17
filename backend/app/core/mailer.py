import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader
from typing import Optional
from .config import settings


class Mailer:
    def __init__(self):
        # Setup Jinja2 environment
        template_dir = os.path.join(os.path.dirname(__file__), '..', 'templates')
        self.jinja_env = Environment(loader=FileSystemLoader(template_dir))
    
    def render_template(self, template_name: str, **context) -> str:
        """Render HTML template with context variables"""
        try:
            template = self.jinja_env.get_template(template_name)
            return template.render(**context)
        except Exception as e:
            raise RuntimeError(f"Error rendering template {template_name}: {str(e)}")
    
    def send_email(self, to: str, subject: str, html_content: str) -> bool:
        """Send email using Gmail SMTP"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = settings.MAIL_FROM
            msg['To'] = to
            
            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Connect to Gmail SMTP
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASS)
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            print(f"Error sending email to {to}: {str(e)}")
            return False


# Singleton instance
mailer = Mailer()


def render_template(template_name: str, **context) -> str:
    """Render template function"""
    return mailer.render_template(template_name, **context)


def send_email(to: str, subject: str, html_content: str) -> bool:
    """Send email function"""
    return mailer.send_email(to, subject, html_content)
