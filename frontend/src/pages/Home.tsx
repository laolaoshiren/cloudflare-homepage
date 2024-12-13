import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { API_BASE_URL } from '../config';
import { formatIcon } from '../utils/iconHelper';
import { SectionTitle } from '../components/common';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const matrixAnimation = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  background: 
    linear-gradient(rgba(15, 15, 15, 0.95), rgba(15, 15, 15, 0.95)),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(79, 172, 254, 0.1) 10px,
      rgba(79, 172, 254, 0.1) 20px
    ),
    linear-gradient(
      to bottom,
      #0f0f0f,
      #1a1a1a
    );
  background-size: 200% 200%, 100% 100%, 100% 100%;
  animation: ${matrixAnimation} 15s linear infinite;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  gap: 4rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(79, 172, 254, 0.1) 0%,
      transparent 50%
    );
    pointer-events: none;
  }
`;

const Content = styled.div`
  position: relative;
  text-align: center;
  max-width: 800px;
  width: 100%;
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h1`
  font-size: 4.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #00f2fe, #4facfe);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #4facfe;
  font-weight: 500;
  opacity: 0;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.3s;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #b3b3b3;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.6s;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SocialLinks = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.9s;
  padding: 0 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #fff;
  font-size: 1.2rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border: 2px solid #4facfe;
  border-radius: 8px;
  text-decoration: none;
  min-width: 120px;
  margin: 0.5rem;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    
    svg {
      width: 100%;
      height: 100%;
    }
  }

  &:hover {
    background: #4facfe;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(79, 172, 254, 0.3);
  }
`;

interface Profile {
  name: string;
  title: string;
  description: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

interface Link {
  id: number;
  title: string;
  url: string;
  icon?: string;
}

interface Contact {
  id: number;
  type: string;
  value: string;
  icon?: string;
}

const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // 加载个人信息
    fetch(`${API_BASE_URL}/api/profile`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data) throw new Error('No profile data found');
        setProfile(data);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setError(error.message);
      });

    // 加载链接
    fetch(`${API_BASE_URL}/api/links`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setLinks(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching links:', error);
        setLinks([]);
      });

    // 加载联系方式
    fetch(`${API_BASE_URL}/api/contacts`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setContacts(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
        setContacts([]);
      });
  }, []);

  if (error) {
    return (
      <HomeContainer>
        <Content>
          <Title>Error</Title>
          <Description>{error}</Description>
        </Content>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Content>
        <Title>{profile?.name || 'Loading...'}</Title>
        <Subtitle>{profile?.title}</Subtitle>
        <Description>{profile?.description}</Description>
        <SocialLinks>
          {links.map(link => (
            <SocialLink 
              key={link.id}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ justifyContent: link.icon ? 'flex-start' : 'center' }}
            >
              {link.icon && (
                <span 
                  className="icon"
                  dangerouslySetInnerHTML={{ __html: formatIcon(link.icon) }} 
                />
              )}
              {link.title}
            </SocialLink>
          ))}
        </SocialLinks>
      </Content>

      <Content>
        <StyledSectionTitle>联系方式</StyledSectionTitle>
        <ContactGrid>
          {contacts.map(contact => (
            <ContactCard key={contact.id}>
              {contact.icon && (
                <ContactIcon>
                  <img src={contact.icon} alt={contact.type} width="32" height="32" />
                </ContactIcon>
              )}
              <ContactType>{contact.type}</ContactType>
              <ContactValue>{contact.value}</ContactValue>
            </ContactCard>
          ))}
        </ContactGrid>
      </Content>
    </HomeContainer>
  );
};

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 0;
`;

const ContactCard = styled.div`
  background: rgba(42, 42, 42, 0.3);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-3px);
    border-color: #4facfe;
    background: rgba(42, 42, 42, 0.5);
    box-shadow: 0 5px 15px rgba(79, 172, 254, 0.2);
  }
`;

const ContactIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #4facfe;

  img {
    width: 24px;
    height: 24px;
  }
`;

const ContactType = styled.h3`
  color: #fff;
  margin-bottom: 0.4rem;
  font-size: 1rem;
`;

const ContactValue = styled.p`
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #00f2fe, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export default Home; 