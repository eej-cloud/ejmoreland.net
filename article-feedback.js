import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const supabaseUrl = 'https://kbftlhbtwwvnlpgvdkwf.supabase.co';
const supabasePublishableKey = 'sb_publishable_ZWL28NOdWxhZdJRZbNn3IA_d8G_tHbV';
const feedbackUrl = `${supabaseUrl}/functions/v1/article-feedback`;
const feedback = document.querySelector('.article-feedback');

if (feedback) {
  const articleSlug = feedback.dataset.articleSlug;
  const summaries = document.querySelectorAll(`[data-feedback-summary][data-article-slug="${articleSlug}"]`);
  const buttons = [...feedback.querySelectorAll('[data-vote]')];
  const status = feedback.querySelector('.feedback-status');
  const client = createClient(supabaseUrl, supabasePublishableKey);

  const setSummary = ({ up, total, approvalPercent }) => {
    const label = total === 0
      ? 'No reader votes yet'
      : `${up} thumbs up · ${approvalPercent}% positive`;
    summaries.forEach((summary) => { summary.textContent = label; });
  };

  const setSelection = (myVote) => {
    buttons.forEach((button) => {
      const selected = Number(button.dataset.vote) === myVote;
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = false;
    });
  };

  const getSession = async () => {
    let { data: { session } } = await client.auth.getSession();
    if (!session) {
      const { data, error } = await client.auth.signInAnonymously();
      if (error) throw error;
      session = data.session;
    }
    if (!session?.access_token) throw new Error('No browser session');
    return session;
  };

  const requestFeedback = async (vote) => {
    const session = await getSession();
    const response = await fetch(feedbackUrl, {
      method: 'POST',
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleSlug, ...(vote === undefined ? {} : { vote }) }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Feedback is unavailable');
    return payload;
  };

  const showUnavailable = () => {
    summaries.forEach((summary) => { summary.textContent = 'Reader response unavailable'; });
    buttons.forEach((button) => { button.disabled = true; });
    status.textContent = 'Reader feedback is temporarily unavailable.';
    status.classList.add('is-error');
  };

  const load = async () => {
    try {
      const data = await requestFeedback();
      setSummary(data);
      setSelection(data.myVote);
      status.textContent = data.myVote === null ? 'Choose a response.' : 'Your response is saved. You can change it any time.';
    } catch (error) {
      console.error('article_feedback_load_failed', error);
      showUnavailable();
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const vote = Number(button.dataset.vote);
      buttons.forEach((item) => { item.disabled = true; });
      status.classList.remove('is-error');
      status.textContent = 'Saving your response…';
      try {
        const data = await requestFeedback(vote);
        setSummary(data);
        setSelection(data.myVote);
        status.textContent = 'Your response is saved. You can change it any time.';
      } catch (error) {
        console.error('article_feedback_save_failed', error);
        status.textContent = 'Your response could not be saved. Please try again.';
        status.classList.add('is-error');
        buttons.forEach((item) => { item.disabled = false; });
      }
    });
  });

  load();
}
