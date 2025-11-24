import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageBlob, prompt, strength } = await request.json();

    console.log('AI Generation Request:', { prompt, strength });

    // Get API keys from server-side environment variables (not NEXT_PUBLIC_)
    const stabilityKey = process.env.STABILITY_API_KEY;
    const replicateKey = process.env.REPLICATE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Priority: Stability AI > Replicate > OpenAI
    let service = 'demo';
    let apiKey = '';
    let endpoint = '';

    if (stabilityKey) {
      service = 'stability';
      apiKey = stabilityKey;
      endpoint = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image';
    } else if (replicateKey) {
      service = 'replicate';
      apiKey = replicateKey;
      endpoint = 'https://api.replicate.com/v1/predictions';
    } else if (openaiKey) {
      service = 'openai';
      apiKey = openaiKey;
      endpoint = 'https://api.openai.com/v1/images/generations';
    }

    if (service === 'demo') {
      // Demo mode - return a mock fox person image
      console.log('Using demo mode - returning fox.png');
      return NextResponse.json({ 
        result: '/fox.png' // Use existing fox image from public folder
      });
    }

    // Call AI service based on configuration
    let result;
    switch (service) {
      case 'stability':
        result = await generateWithStability(imageBlob, prompt, strength, apiKey, endpoint);
        break;
      case 'replicate':
        result = await generateWithReplicate(imageBlob, prompt, strength, apiKey, endpoint);
        break;
      case 'openai':
        result = await generateWithOpenAI(imageBlob, prompt, strength, apiKey, endpoint);
        break;
      default:
        throw new Error('Unsupported service');
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI generation error:', error);
    const message = error instanceof Error ? error.message : 'AI generation failed';
    const isTimeout = /timeout|aborted/i.test(message);
    
    return NextResponse.json({ 
      error: message,
      details: isTimeout ? 'AI generation request timed out. Please try again.' : undefined
    }, { status: isTimeout ? 504 : 500 });
  }
}

async function generateWithStability(imageBlob: string, prompt: string, strength: number, apiKey: string, endpoint: string) {
  // Convert base64 to blob
  const response = await fetch(imageBlob);
  const blob = await response.blob();

  const formData = new FormData();
  formData.append('init_image', blob, 'input.jpg');
  
  const strengthText = strength >= 0.8 ? "high transformation" : strength >= 0.5 ? "medium transformation" : "subtle transformation";
  const enhancedPrompt = `Transform this person into a beautiful fox person with ${strengthText}: ${prompt}, anthropomorphic fox, detailed orange fur, pointy fox ears, bushy fox tail, human-like body, high quality, detailed, professional photography`;
  formData.append('text_prompts[0][text]', enhancedPrompt);
  formData.append('text_prompts[0][weight]', '1');
  formData.append('text_prompts[1][text]', 'low quality, blurry, distorted, bad anatomy, deformed, ugly, bad proportions');
  formData.append('text_prompts[1][weight]', '-1');
  formData.append('cfg_scale', '7.5');
  formData.append('steps', '30');
  formData.append('samples', '1');
  formData.append('style_preset', 'photographic');

  const response2 = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
    body: formData,
    signal: AbortSignal.timeout(60000), // 60 second timeout for AI generation
  });

  if (!response2.ok) {
    const errorText = await response2.text();
    throw new Error(`Stability AI failed: ${response2.status} - ${errorText}`);
  }

  const result = await response2.json();
  
  if (result.artifacts && result.artifacts.length > 0) {
    return `data:image/png;base64,${result.artifacts[0].base64}`;
  } else {
    throw new Error('No image generated');
  }
}

async function generateWithReplicate(imageBlob: string, prompt: string, strength: number, apiKey: string, endpoint: string) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        image: imageBlob,
        prompt: `fox person: ${prompt}`,
        strength: strength
      }
    }),
    signal: AbortSignal.timeout(60000), // 60 second timeout for AI generation
  });

  if (!response.ok) {
    throw new Error(`Replicate failed: ${response.status}`);
  }

  const result = await response.json();
  return result.output[0];
}

async function generateWithOpenAI(imageBlob: string, prompt: string, strength: number, apiKey: string, endpoint: string) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: `Transform this person into a fox person with strength ${strength}: ${prompt}`,
      n: 1,
      size: "1024x1024"
    }),
    signal: AbortSignal.timeout(60000), // 60 second timeout for AI generation
  });

  if (!response.ok) {
    throw new Error(`OpenAI failed: ${response.status}`);
  }

  const result = await response.json();
  return result.data[0].url;
}

