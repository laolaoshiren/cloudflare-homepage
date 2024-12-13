import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_BASE_URL } from '../config';
import { formatIcon } from '../utils/iconHelper';
import { Checkbox, Label } from '../components/common';

// 首先定义基础样式组件，不包含对其他组件的引用
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 0.5rem;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  color: #fff;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #4facfe;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #00f2fe;
  }
`;

// 定义链接相关的样式组件
const StyledLinkList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  margin: 2rem auto;
`;

const StyledLinkItem = styled.div`
  display: grid;
  grid-template-columns: 40px 200px 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr auto;
    grid-template-areas:
      "icon title delete"
      "icon url delete";
  }
`;

// 定义嵌套样式
const EditForm = styled(Form)`
  max-width: 100%;
  margin: 0;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const EditInput = styled(Input)`
  flex: 1;
  min-width: 150px;
`;

const EditButton = styled(Button)`
  padding: 0.25rem 0.5rem;
`;

const Message = styled.p<{ success: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  background-color: ${props => props.success ? '#4caf50' : '#f44336'};
  color: white;
`;

// 然后定义其他样式组件
const AdminContainer = styled.div`
  padding: 2rem;
  background: #1a1a1a;
  color: #fff;
  min-height: 100vh;
`;

const StyledLinkIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #4facfe;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    grid-area: icon;
  }
`;

const StyledLinkTitle = styled.span`
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    grid-area: title;
  }
`;

const StyledLinkUrl = styled.span`
  color: #4facfe;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    grid-area: url;
  }
`;

// 定义按钮组相关的样式组件
const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DeleteButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: #f44336;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #d32f2f;
  }
`;

// 最后定义其他样式组件
const IconPreview = styled.div`
  margin-top: 0.5rem;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ContactList = styled.div`
  margin-top: 2rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const PrivateTag = styled.span`
  color: #f44336;
`;

// 接口定义
interface Profile {
  name: string;
  title: string;
  description: string;
}

interface Link {
  id?: number;
  title: string;
  url: string;
  icon?: string;
  sort_order?: number;
}

interface Contact {
  id?: number;
  type: string;
  value: string;
  icon?: string;
  is_public: boolean;
  sort_order?: number;
}

const Admin: React.FC = () => {
  const [formData, setFormData] = useState<Profile>({
    name: '',
    title: '',
    description: '',
  });
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [newLink, setNewLink] = useState<Link>({
    title: '',
    url: '',
    icon: '',
    sort_order: 0
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState<Contact>({
    type: '',
    value: '',
    icon: '',
    is_public: true,
    sort_order: 0
  });
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${API_BASE_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Received data:', data);
        if (data) {
          setFormData(data);
        }
      })
      .catch(error => {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          error
        });
        setMessage('加载失败：' + error.message);
      });
  }, []);

  // 加载链接列表
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/links`);
        if (!response.ok) throw new Error('Failed to fetch links');
        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks();
  }, []);

  // 加载联系方式
  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Update response data:', data);
      
      if (data.success) {
        setMessage('更新成功！');
      } else {
        throw new Error('更新失败');
      }
    } catch (err) {
      console.error('Update error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        error: err
      });
      const errorMessage = err instanceof Error ? err.message : '更新失败';
      setMessage('更新失败：' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 添加 URL 处理函数
  const normalizeUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    return `https://${url}`;
  };

  // 修改添加链接的处理函数
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      // 创建一个新对象，包含规范化的 URL
      const linkData = {
        ...newLink,
        url: normalizeUrl(newLink.url)
      };

      const response = await fetch(`${API_BASE_URL}/api/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(linkData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add link');
      }
      
      const result = await response.json();
      if (result.success) {
        setLinks([...links, { ...linkData, id: result.id }]);
        setNewLink({ title: '', url: '', icon: '', sort_order: 0 });
        setMessage('链接添加成功！');
      } else {
        throw new Error('Failed to add link');
      }
    } catch (error) {
      console.error('Error adding link:', error);
      setMessage('添加链接失败：' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // 删除链接
  const handleDeleteLink = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete link');
      
      setLinks(links.filter(link => link.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  // 添加联系方式处理函数
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add contact');
      }
      
      const result = await response.json();
      if (result.success) {
        setContacts([...contacts, { ...newContact, id: result.id }]);
        setNewContact({ type: '', value: '', icon: '', is_public: true, sort_order: 0 });
        setMessage('联系方式添加��功！');
      }
    } catch (error) {
      setMessage('添加联系方式失败：' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // 删除联系方式
  const handleDeleteContact = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete contact');
      
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // 修改链接添加表单部分
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewLink(prev => ({ ...prev, icon: value }));
  };

  // 添加编辑处理函数
  const handleEditLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink?.id) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/links/${editingLink.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingLink),
      });

      if (!response.ok) {
        throw new Error('Failed to update link');
      }

      setLinks(links.map(link => 
        link.id === editingLink.id ? editingLink : link
      ));
      setEditingLink(null);
      setMessage('链接更新成功！');
    } catch (error) {
      setMessage('更新失败：' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <AdminContainer>
      <h1>管理后台</h1>
      {message && (
        <Message success={message.includes('成功')}>
          {message}
        </Message>
      )}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="名字"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          disabled={isLoading}
        />
        <Input
          type="text"
          placeholder="职位"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          disabled={isLoading}
        />
        <Input
          type="text"
          placeholder="描述"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '更新中...' : '更新信息'}
        </Button>
      </Form>

      <h2>友情链接管理</h2>
      <Form onSubmit={handleAddLink}>
        <Input
          type="text"
          placeholder="链接标题"
          value={newLink.title}
          onChange={e => setNewLink(prev => ({ ...prev, title: e.target.value }))}
        />
        <Input
          type="text"
          placeholder="链接地址"
          value={newLink.url}
          onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
        />
        <Input
          type="text"
          placeholder="图标 (支持 Emoji、SVG URL 或 SVG 代码)"
          value={newLink.icon || ''}
          onChange={handleIconChange}
        />
        {newLink.icon && (
          <IconPreview>
            <span>图标预览：</span>
            <div dangerouslySetInnerHTML={{ __html: formatIcon(newLink.icon) }} />
          </IconPreview>
        )}
        <Input
          type="number"
          placeholder="排序 (可选)"
          value={newLink.sort_order || 0}
          onChange={e => setNewLink(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
        />
        <Button type="submit">添加链接</Button>
      </Form>

      <StyledLinkList>
        {links.map(link => (
          <StyledLinkItem key={link.id}>
            {editingLink?.id === link.id ? (
              <EditForm onSubmit={handleEditLink}>
                <EditInput
                  type="text"
                  value={editingLink?.title || ''}
                  onChange={e => setEditingLink(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                />
                <EditInput
                  type="text"
                  value={editingLink?.url || ''}
                  onChange={e => setEditingLink(prev => prev ? ({ ...prev, url: e.target.value }) : null)}
                />
                <EditInput
                  type="text"
                  value={editingLink?.icon || ''}
                  onChange={e => setEditingLink(prev => prev ? ({ ...prev, icon: e.target.value }) : null)}
                />
                <EditButton type="submit">保存</EditButton>
                <EditButton type="button" onClick={() => setEditingLink(null)}>取消</EditButton>
              </EditForm>
            ) : (
              <>
                {link.icon && <StyledLinkIcon dangerouslySetInnerHTML={{ __html: formatIcon(link.icon) }} />}
                <StyledLinkTitle>{link.title}</StyledLinkTitle>
                <StyledLinkUrl>{link.url}</StyledLinkUrl>
                <ButtonGroup>
                  <EditButton onClick={() => setEditingLink(link)}>编辑</EditButton>
                  <DeleteButton onClick={() => link.id && handleDeleteLink(link.id)}>删除</DeleteButton>
                </ButtonGroup>
              </>
            )}
          </StyledLinkItem>
        ))}
      </StyledLinkList>

      <h2>联系方式管理</h2>
      <Form onSubmit={handleAddContact}>
        <Input
          type="text"
          placeholder="类型 (如: Email, 电话, 微信)"
          value={newContact.type}
          onChange={e => setNewContact(prev => ({ ...prev, type: e.target.value }))}
        />
        <Input
          type="text"
          placeholder="值"
          value={newContact.value}
          onChange={e => setNewContact(prev => ({ ...prev, value: e.target.value }))}
        />
        <Input
          type="text"
          placeholder="图标 URL (可选)"
          value={newContact.icon || ''}
          onChange={e => setNewContact(prev => ({ ...prev, icon: e.target.value }))}
        />
        <Checkbox
          checked={newContact.is_public}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setNewContact(prev => ({ ...prev, is_public: e.target.checked }))
          }
        />
        <Label>公开显示</Label>
        <Input
          type="number"
          placeholder="排序 (可选)"
          value={newContact.sort_order || 0}
          onChange={e => setNewContact(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
        />
        <Button type="submit">添加联系方式</Button>
      </Form>

      <ContactList>
        {contacts.map(contact => (
          <ContactItem key={contact.id}>
            <ContactInfo>
              <strong>{contact.type}:</strong> {contact.value}
              {!contact.is_public && <PrivateTag>私密</PrivateTag>}
            </ContactInfo>
            <DeleteButton onClick={() => contact.id && handleDeleteContact(contact.id)}>
              删除
            </DeleteButton>
          </ContactItem>
        ))}
      </ContactList>
    </AdminContainer>
  );
};

export default Admin; 