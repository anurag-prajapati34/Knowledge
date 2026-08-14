from app.config import settings
from celery import Celery

celery_app = Celery(
    "knowledge_worker",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

# celery_app.autodiscover_tasks(["app.workers.tasks"])
import app.workers.tasks.process_document  # noqa
