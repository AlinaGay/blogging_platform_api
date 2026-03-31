import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_post(client: AsyncClient):
    response = await client.post(
        "/api/v1/posts",
        json={"title": "Test Post", "body": "Test body content"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "Test Post"
    assert data["body"] == "Test body content"
    assert data["created_at"] is not None
    assert data["updated_at"] is not None


@pytest.mark.asyncio
async def test_create_post_with_optional_fields(client: AsyncClient):
    response = await client.post(
        "/api/v1/posts",
        json={
            "title": "Tagged Post",
            "body": "Content",
            "summary": "A summary",
            "tags": ["python", "api"],
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["summary"] == "A summary"
    assert data["tags"] == ["python", "api"]


@pytest.mark.asyncio
async def test_create_post_missing_title(client: AsyncClient):
    response = await client.post(
        "/api/v1/posts",
        json={"body": "No title"},
    )
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_create_post_missing_body(client: AsyncClient):
    response = await client.post(
        "/api/v1/posts",
        json={"title": "No body"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_list_posts_empty(client: AsyncClient):
    response = await client.get("/api/v1/posts")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_list_posts(client: AsyncClient):
    await client.post("/api/v1/posts", json={"title": "First", "body": "Body 1"})
    await client.post("/api/v1/posts", json={"title": "Second", "body": "Body 2"})

    response = await client.get("/api/v1/posts")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2
    # body should not be in list items
    assert "body" not in data["items"][0]


@pytest.mark.asyncio
async def test_list_posts_pagination(client: AsyncClient):
    for i in range(5):
        await client.post("/api/v1/posts", json={"title": f"Post {i}", "body": f"Body {i}"})

    response = await client.get("/api/v1/posts", params={"skip": 2, "limit": 2})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 2
    assert data["skip"] == 2
    assert data["limit"] == 2


@pytest.mark.asyncio
async def test_get_post(client: AsyncClient):
    create = await client.post("/api/v1/posts", json={"title": "Get Me", "body": "Content"})
    post_id = create.json()["id"]

    response = await client.get(f"/api/v1/posts/{post_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Get Me"
    assert data["body"] == "Content"


@pytest.mark.asyncio
async def test_get_post_not_found(client: AsyncClient):
    response = await client.get("/api/v1/posts/999")
    assert response.status_code == 404
    data = response.json()
    assert data["error"]["code"] == "NOT_FOUND"


@pytest.mark.asyncio
async def test_update_post(client: AsyncClient):
    create = await client.post("/api/v1/posts", json={"title": "Original", "body": "Body"})
    post_id = create.json()["id"]

    response = await client.put(
        f"/api/v1/posts/{post_id}",
        json={"title": "Updated Title"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["body"] == "Body"  # unchanged


@pytest.mark.asyncio
async def test_update_post_not_found(client: AsyncClient):
    response = await client.put("/api/v1/posts/999", json={"title": "Nope"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_post(client: AsyncClient):
    create = await client.post("/api/v1/posts", json={"title": "Delete Me", "body": "Body"})
    post_id = create.json()["id"]

    response = await client.delete(f"/api/v1/posts/{post_id}")
    assert response.status_code == 204

    get_response = await client.get(f"/api/v1/posts/{post_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_delete_post_not_found(client: AsyncClient):
    response = await client.delete("/api/v1/posts/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_search_posts(client: AsyncClient):
    await client.post("/api/v1/posts", json={"title": "Python Tutorial", "body": "Learn Python"})
    await client.post("/api/v1/posts", json={"title": "Rust Guide", "body": "Learn Rust"})

    response = await client.get("/api/v1/posts", params={"search": "python"})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "Python Tutorial"


@pytest.mark.asyncio
async def test_search_no_results(client: AsyncClient):
    await client.post("/api/v1/posts", json={"title": "Hello", "body": "World"})

    response = await client.get("/api/v1/posts", params={"search": "nonexistent"})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["items"] == []
