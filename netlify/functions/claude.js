exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }, body: '' };
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { prompt, style, length, keywords } = JSON.parse(event.body);
    const lengthMap = { '짧게': '500자 내외', '보통': '800~1000자', '길게': '1500자 이상' };
    const fullPrompt = "당신은 제과제빵·바리스타 학원 블로그 전문 작가입니다.\n"
      + "학원명: 퍼스트바리스타·제과제빵학원 (화성캠퍼스)\n"
      + "블로그 주제: " + prompt + "\n"
      + "글쓰기 스타일: " + style + "한 톤\n"
      + "글 길이: " + (lengthMap[length] || '800~1000자') + "\n"
      + "핵심 키워드: " + (keywords || '없음') + "\n\n"
      + "위 조건에 맞게 네이버 블로그용 글을 작성해주세요.\n"
      + "- 제목으로 시작\n- 소제목으로 단락 구분\n- 자연스럽고 읽기 쉬운 문체\n- 마지막에 학원 소개 및 문의 유도 문구 포함";
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.CLAUDE_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2000, messages: [{ role: 'user', content: fullPrompt }] }),
    });
    const data = await response.json();
    if (data.error) return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: data.error.message }) };
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify({ result: data.content[0].text }) };
  } catch (err) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: err.message }) };
  }
};
