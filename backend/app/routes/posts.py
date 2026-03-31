from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Post
from app.schemas import (
    PostCreate,
    PostListItem,
    PostListResponse,
    PostResponse,
    PostUpdate,
)

router = APIRouter(prefix="/api/v1/posts", tags=["posts"])


@router.post("", status_code=201, response_model=PostResponse)
async def create_post(data: PostCreate, db: AsyncSession = Depends(get_db)):
    post = Post(
        title=data.title,
        body=data.body,
        summary=data.summary,
        tags=data.tags or [],
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


@router.get("", response_model=PostListResponse)
async def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None, min_length=1),
    db: AsyncSession = Depends(get_db),
):
    query = select(Post)

    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(Post.title.ilike(pattern), Post.body.ilike(pattern))
        )

    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    query = query.order_by(Post.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    posts = result.scalars().all()

    return PostListResponse(
        items=[PostListItem.model_validate(p) for p in posts],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {post_id} not found")
    return post


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(post_id: int, data: PostUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {post_id} not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)

    post.updated_at = func.now()
    await db.commit()
    await db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=204)
async def delete_post(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail=f"Post with id {post_id} not found")

    await db.delete(post)
    await db.commit()
