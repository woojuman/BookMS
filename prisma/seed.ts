import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 기존 데이터 삭제
  await prisma.book.deleteMany()

  // 샘플 데이터 추가
  const books = [
    {
      title: "클린 코드",
      author: "로버트 C. 마틴",
      genre: "프로그래밍",
      readDate: new Date("2024-01-15"),
      rating: 5,
      review: "개발자라면 반드시 읽어야 할 책. 코드의 품질을 높이는 다양한 기법들을 배울 수 있었다.",
      pages: 464
    },
    {
      title: "해리 포터와 마법사의 돌",
      author: "J.K. 롤링",
      genre: "판타지",
      readDate: new Date("2024-02-20"),
      rating: 4,
      review: "어린 시절의 추억을 되살려주는 마법 같은 이야기. 상상력이 풍부한 세계관이 인상적이다.",
      pages: 309
    },
    {
      title: "사피엔스",
      author: "유발 하라리",
      genre: "역사/인문",
      readDate: new Date("2024-03-10"),
      rating: 5,
      review: "인류의 역사를 새로운 관점에서 바라볼 수 있게 해주는 책. 매우 흥미롭고 생각할 거리가 많다.",
      pages: 512
    }
    ,{
        title: "사피엔스2",
        author: "유발 하라리",
        genre: "역사/인문",
        readDate: new Date("2024-03-10"),
        rating: 5,
        review: "인류의 역사를 새로운 관점에서 바라볼 수 있게 해주는 책. 매우 흥미롭고 생각할 거리가 많다.",
        pages: 512
      }
  ]

  for (const book of books) {
    await prisma.book.create({
      data: book
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })