from datetime import datetime

from pydantic import BaseModel, Field


class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    body: str = Field(..., min_length=1, max_length=50000)
    summary: str | None = Field(None, max_length=500)
    tags: list[str] | None = Field(None)


class PostUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    body: str | None = Field(None, min_length=1, max_length=50000)
    summary: str | None = Field(None, max_length=500)
    tags: list[str] | None = Field(None)


class PostResponse(BaseModel):
    id: int
    title: str
    body: str
    summary: str | None
    tags: list[str] | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PostListItem(BaseModel):
    id: int
    title: str
    summary: str | None
    tags: list[str] | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    items: list[PostListItem]
    total: int
    skip: int
    limit: int


class ErrorDetail(BaseModel):
    field: str
    message: str


class ErrorBody(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] | None = None


class ErrorResponse(BaseModel):
    error: ErrorBody
