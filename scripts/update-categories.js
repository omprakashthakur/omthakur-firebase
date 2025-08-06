require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateCategories() {
  try {
    console.log('🔄 Updating vlog categories...');
    
    // Update "Daily Life" to "Daily"
    const { data: dailyUpdate, error: dailyError } = await supabase
      .from('vlogs')
      .update({ category: 'Daily' })
      .eq('category', 'Daily Life');
    
    if (dailyError) {
      console.error('Error updating Daily Life categories:', dailyError);
    } else {
      console.log('✅ Updated "Daily Life" to "Daily"');
    }
    
    // Update "Tech Talks" to "Tech"
    const { data: techUpdate, error: techError } = await supabase
      .from('vlogs')
      .update({ category: 'Tech' })
      .eq('category', 'Tech Talks');
    
    if (techError) {
      console.error('Error updating Tech Talks categories:', techError);
    } else {
      console.log('✅ Updated "Tech Talks" to "Tech"');
    }
    
    console.log('🎉 Category update completed!');
    
  } catch (error) {
    console.error('❌ Error updating categories:', error);
  }
}

updateCategories();
