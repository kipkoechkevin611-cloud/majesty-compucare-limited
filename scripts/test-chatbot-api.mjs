async function testChatbotAPI() {
  const baseUrl = 'http://localhost:3000'
  
  const testCases = [
    {
      name: 'Greeting',
      messages: [{ role: 'user', content: 'Hello' }]
    },
    {
      name: 'Location - Where are you located',
      messages: [{ role: 'user', content: 'Where are you located?' }]
    },
    {
      name: 'Location - Where is Majesty Compucare',
      messages: [{ role: 'user', content: 'Where is Majesty Compucare located?' }]
    },
    {
      name: 'Location - Address',
      messages: [{ role: 'user', content: 'What is your address?' }]
    },
    {
      name: 'Location - Nakuru branch',
      messages: [{ role: 'user', content: 'Do you have a branch in Nakuru?' }]
    },
    {
      name: 'Contact - How can I reach you',
      messages: [{ role: 'user', content: 'How can I reach you?' }]
    },
    {
      name: 'Contact - Phone numbers',
      messages: [{ role: 'user', content: 'What are your phone numbers?' }]
    },
    {
      name: 'Contact - WhatsApp',
      messages: [{ role: 'user', content: 'What is your WhatsApp number?' }]
    },
    {
      name: 'Contact - Email',
      messages: [{ role: 'user', content: 'What is your email address?' }]
    },
    {
      name: 'Business Hours',
      messages: [{ role: 'user', content: 'What are your business hours?' }]
    },
    {
      name: 'Products - What do you sell',
      messages: [{ role: 'user', content: 'What products do you sell?' }]
    },
    {
      name: 'Delivery',
      messages: [{ role: 'user', content: 'Do you offer delivery?' }]
    },
    {
      name: 'Warranty Policy',
      messages: [{ role: 'user', content: 'What is your warranty policy?' }]
    },
    {
      name: 'Payment Methods',
      messages: [{ role: 'user', content: 'What payment methods do you accept?' }]
    },
    {
      name: 'Return Policy',
      messages: [{ role: 'user', content: 'What is your return policy?' }]
    },
    {
      name: 'About Company',
      messages: [{ role: 'user', content: 'Tell me about Majesty Compucare Limited' }]
    },
  ]

  console.log('Testing Chatbot API...\n')

  for (const testCase of testCases) {
    console.log(`\n--- Test: ${testCase.name} ---`)
    console.log(`Input: ${testCase.messages[0].content}`)
    
    try {
      const response = await fetch(`${baseUrl}/api/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: testCase.messages,
          sessionId: 'test-session'
        })
      })

      const text = await response.text()
      console.log(`Response status: ${response.status}`)
      
      const data = JSON.parse(text)
      
      if (response.ok) {
        console.log(`✓ Success`)
        console.log(`Response: ${data.text?.substring(0, 200)}...`)
        
        // Check if response contains expected keywords
        const responseLower = data.text?.toLowerCase() || ''
        const inputLower = testCase.messages[0].content.toLowerCase()
        
        // Validate location responses
        if (inputLower.includes('where') || inputLower.includes('located') || inputLower.includes('address')) {
          if (responseLower.includes('nakuru') && responseLower.includes('kisumu')) {
            console.log(`✓ Location info correct (both branches)`)
          } else {
            console.log(`✗ Location info incomplete`)
          }
        }
        
        // Validate branch-specific responses
        if (inputLower.includes('branch') && inputLower.includes('nakuru')) {
          if (responseLower.includes('nakuru') && responseLower.includes('nyakinyua')) {
            console.log(`✓ Nakuru branch info correct`)
          } else {
            console.log(`✗ Nakuru branch info incomplete`)
          }
        }
        
        // Validate contact responses
        if (inputLower.includes('reach') || inputLower.includes('phone') || inputLower.includes('contact')) {
          if (responseLower.includes('0716') || responseLower.includes('0111')) {
            console.log(`✓ Contact info correct`)
          } else {
            console.log(`✗ Contact info incomplete`)
          }
        }
        
        // Validate email response
        if (inputLower.includes('email')) {
          if (responseLower.includes('@') && responseLower.includes('gmail')) {
            console.log(`✓ Email info correct`)
          } else {
            console.log(`✗ Email info incorrect`)
          }
        }
        
        // Validate WhatsApp response
        if (inputLower.includes('whatsapp')) {
          if (responseLower.includes('0716') || responseLower.includes('0111')) {
            console.log(`✓ WhatsApp info correct`)
          } else {
            console.log(`✗ WhatsApp info incorrect`)
          }
        }
        
        // Validate business hours
        if (inputLower.includes('hours') || inputLower.includes('open')) {
          if (responseLower.includes('8:00') || responseLower.includes('8am')) {
            console.log(`✓ Business hours info correct`)
          } else {
            console.log(`✗ Business hours info incorrect`)
          }
        }
        
        // Validate products response
        if (inputLower.includes('products') || inputLower.includes('sell')) {
          if (responseLower.includes('laptop') || responseLower.includes('printer')) {
            console.log(`✓ Products info correct`)
          } else {
            console.log(`✗ Products info incorrect`)
          }
        }
        
        // Validate delivery response
        if (inputLower.includes('delivery') || inputLower.includes('shipping')) {
          if (responseLower.includes('nakuru') || responseLower.includes('kisumu')) {
            console.log(`✓ Delivery info correct`)
          } else {
            console.log(`✗ Delivery info incorrect`)
          }
        }
        
        // Validate warranty response
        if (inputLower.includes('warranty')) {
          if (responseLower.includes('year') || responseLower.includes('month')) {
            console.log(`✓ Warranty info correct`)
          } else {
            console.log(`✗ Warranty info incorrect`)
          }
        }
        
        // Validate payment response
        if (inputLower.includes('payment')) {
          if (responseLower.includes('mpesa') || responseLower.includes('cash')) {
            console.log(`✓ Payment info correct`)
          } else {
            console.log(`✗ Payment info incorrect`)
          }
        }
        
        // Validate return response
        if (inputLower.includes('return') || inputLower.includes('refund')) {
          if (responseLower.includes('7') || responseLower.includes('day')) {
            console.log(`✓ Return policy info correct`)
          } else {
            console.log(`✗ Return policy info incorrect`)
          }
        }
        
        if (data.quickReplies?.length > 0) {
          console.log(`Quick replies: ${data.quickReplies.join(', ')}`)
        }
      } else {
        console.log(`✗ Failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.log(`✗ Error: ${error.message}`)
    }
  }

  console.log('\n--- Test Complete ---')
}

testChatbotAPI()
