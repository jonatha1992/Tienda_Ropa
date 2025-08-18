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
            
            print(f"Attempting to send email to {to} via {settings.SMTP_HOST}:{settings.SMTP_PORT}")
            print(f"Using SMTP user: {settings.SMTP_USER}")
            
            # Connect to Gmail SMTP with timeout
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                print("Connected to SMTP server")
                
                # Enable debug output
                server.set_debuglevel(1)
                
                # Start TLS encryption
                server.starttls()
                print("TLS started")
                
                # Login with credentials
                print("Attempting to login...")
                server.login(settings.SMTP_USER, settings.SMTP_PASS)
                print("Successfully logged in")
                
                # Send the email
                server.send_message(msg)
                print(f"Email sent successfully to {to}")
            
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            print(f"Authentication Error: {str(e)}")
            print(f"SMTP Server: {settings.SMTP_HOST}:{settings.SMTP_PORT}")
            print(f"Username: {settings.SMTP_USER}")
            print("Note: Make sure you're using an App Password instead of your Gmail password")
            print("and that 2-Step Verification is enabled in your Google Account.")
            return False
            
        except Exception as e:
            print(f"Error sending email to {to}: {str(e)}")
            import traceback
            traceback.print_exc()
            return False
    

# Singleton instance
mailer = Mailer()


def render_template(template_name: str, **context) -> str:
    """Render template function"""
    return mailer.render_template(template_name, **context)


def send_email(to: str, subject: str, html_content: str) -> bool:
    """Send email function"""
    return mailer.send_email(to, subject, html_content)
