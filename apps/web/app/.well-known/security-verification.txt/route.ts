// 외부 보안 점검 업체가 도메인 소유를 확인하는 응답. *.txt는 .gitignore와 미러가 막으므로 라우트로 둔다.
export const dynamic = "force-static";

export function GET() {
  return new Response("security-review-verification=conv-12-subslash-20261023
", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
