import React, { useState } from 'react';
import styled from 'styled-components';
import { MdExpandMore } from 'react-icons/md';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-bottom: 50px;
`;

const CategoryTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1976d2;
  margin: 40px 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
`;

const AccordionItem = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Question = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0;
  flex: 1;
`;

const IconWrapper = styled.div`
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  color: #666;
`;

const AccordionContent = styled.div`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const Answer = styled.div`
  padding: 0 20px 20px;
  color: #666;
  line-height: 1.6;
  
  ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  
  li {
    margin: 5px 0;
  }
  
  strong {
    color: #333;
  }
`;

const faqData = [
  {
    category: "회원가입 및 로그인",
    items: [
      {
        question: "회원가입은 어떻게 하나요?",
        answer: "홈페이지 상단의 '회원가입' 버튼을 클릭하여 개인회원 또는 기업회원으로 가입할 수 있습니다. 필수 정보를 입력하고 이용약관에 동의하면 가입이 완료됩니다."
      },
      {
        question: "로그인이 안 돼요.",
        answer: `로그인이 안 되시는 경우 다음을 확인해주세요:
        <ul>
          <li>아이디와 비밀번호를 정확히 입력했는지 확인</li>
          <li>Caps Lock이 켜져있는지 확인</li>
          <li>브라우저 쿠키가 활성화되어 있는지 확인</li>
          <li>그래도 안 되면 고객센터로 문의해주세요</li>
        </ul>`
      },
      {
        question: "개인회원과 기업회원의 차이는 무엇인가요?",
        answer: "<strong>개인회원</strong>은 채용공고를 검색하고 지원할 수 있으며, 이력서를 관리할 수 있습니다. <strong>기업회원</strong>은 채용공고를 등록하고 지원자를 관리할 수 있습니다."
      }
    ]
  },
  {
    category: "채용공고",
    items: [
      {
        question: "채용공고는 어떻게 등록하나요?",
        answer: "기업회원으로 로그인 후, '채용공고 등록' 메뉴에서 공고를 작성할 수 있습니다. 제목, 내용, 급여, 마감일 등 필수 정보를 입력하면 공고가 등록됩니다."
      },
      {
        question: "채용공고 수정이나 삭제는 어떻게 하나요?",
        answer: "마이페이지의 '채용공고 관리' 메뉴에서 등록한 공고를 확인할 수 있습니다. 각 공고의 수정/삭제 버튼을 통해 관리할 수 있습니다."
      },
      {
        question: "채용공고 마감일이 지나면 어떻게 되나요?",
        answer: "마감일이 지난 공고는 자동으로 '마감' 상태로 변경되며, 더 이상 지원을 받을 수 없습니다. 필요시 공고를 수정하여 마감일을 연장할 수 있습니다."
      }
    ]
  },
  {
    category: "지원하기",
    items: [
      {
        question: "지원은 어떻게 하나요?",
        answer: "개인회원으로 로그인 후, 원하는 채용공고의 상세 페이지에서 '지원하기' 버튼을 클릭합니다. 이력서를 첨부하고 간단한 자기소개를 작성하면 지원이 완료됩니다."
      },
      {
        question: "지원 취소는 가능한가요?",
        answer: "마이페이지의 '지원 현황' 메뉴에서 지원한 공고를 확인할 수 있습니다. 아직 서류 검토 전이라면 '지원 취소' 버튼을 통해 취소할 수 있습니다."
      },
      {
        question: "지원 결과는 어떻게 확인하나요?",
        answer: "지원 결과는 마이페이지의 '지원 현황'에서 확인할 수 있습니다. 서류 통과, 면접 예정, 최종 합격 등의 상태가 표시됩니다."
      }
    ]
  },
  {
    category: "기타",
    items: [
      {
        question: "이력서는 어떻게 등록하나요?",
        answer: "마이페이지의 '이력서 관리' 메뉴에서 이력서를 업로드할 수 있습니다. PDF, DOC, DOCX 형식을 지원하며, 최대 10MB까지 업로드 가능합니다."
      },
      {
        question: "북마크한 공고는 어디서 볼 수 있나요?",
        answer: "상단 메뉴의 '찜한공고' 또는 마이페이지에서 북마크한 채용공고를 확인할 수 있습니다. 하트 아이콘을 클릭하여 북마크를 추가/제거할 수 있습니다."
      },
      {
        question: "쪽지 기능은 어떻게 사용하나요?",
        answer: "채용공고 상세 페이지의 '문의하기' 버튼을 통해 기업에게 쪽지를 보낼 수 있습니다. 받은 쪽지는 상단의 쪽지함에서 확인할 수 있습니다."
      }
    ]
  }
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleAccordion = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Container>
      <Title>자주 묻는 질문</Title>
      <Subtitle>DevJobs 이용에 관한 궁금한 점을 확인해보세요</Subtitle>
      
      {faqData.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <CategoryTitle>{category.category}</CategoryTitle>
          {category.items.map((item, itemIndex) => {
            const isOpen = openItems[`${categoryIndex}-${itemIndex}`];
            return (
              <AccordionItem key={itemIndex}>
                <AccordionHeader 
                  onClick={() => toggleAccordion(categoryIndex, itemIndex)}
                >
                  <Question>{item.question}</Question>
                  <IconWrapper isOpen={isOpen}>
                    <MdExpandMore size={24} />
                  </IconWrapper>
                </AccordionHeader>
                <AccordionContent isOpen={isOpen}>
                  <Answer dangerouslySetInnerHTML={{ __html: item.answer }} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </div>
      ))}
    </Container>
  );
};

export default FAQ;