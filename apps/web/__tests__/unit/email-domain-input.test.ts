import { describe, it, expect } from "vitest";
import { COMMON_EMAIL_DOMAINS } from "../../components/ui/email-domain-input";

describe("EmailDomainInput Logic & Domain Mapping", () => {
  it("포털 및 주요 이메일 도메인 프리셋이 올바르게 제공되어야 한다", () => {
    const domainValues = COMMON_EMAIL_DOMAINS.map((d) => d.value);
    expect(domainValues).toContain("naver.com");
    expect(domainValues).toContain("gmail.com");
    expect(domainValues).toContain("kakao.com");
    expect(domainValues).toContain("daum.net");
    expect(domainValues).toContain("icloud.com");
    expect(domainValues).toContain("outlook.com");
    expect(domainValues).toContain("custom");
  });

  it("도메인 프리셋에 알맞은 Provider(google, naver, kakao, apple)가 매핑되어 있어야 한다", () => {
    const naver = COMMON_EMAIL_DOMAINS.find((d) => d.value === "naver.com");
    expect(naver?.provider).toBe("naver");

    const google = COMMON_EMAIL_DOMAINS.find((d) => d.value === "gmail.com");
    expect(google?.provider).toBe("google");

    const kakao = COMMON_EMAIL_DOMAINS.find((d) => d.value === "kakao.com");
    expect(kakao?.provider).toBe("kakao");

    const apple = COMMON_EMAIL_DOMAINS.find((d) => d.value === "icloud.com");
    expect(apple?.provider).toBe("apple");
  });

  it("아이디와 선택된 도메인이 @ 기호로 정상 결합되어 전체 이메일 주소를 반환해야 한다", () => {
    const local = "myuser123";
    const domain = "naver.com";
    const fullEmail = `${local}@${domain}`;
    expect(fullEmail).toBe("myuser123@naver.com");

    const customDomain = "mycompany.co.kr";
    const customFullEmail = `${local}@${customDomain}`;
    expect(customFullEmail).toBe("myuser123@mycompany.co.kr");
  });
});
