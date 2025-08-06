import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  try {
    console.log('🔄 Updating vlog categories...');
    
    // Update "Daily Life" to "Daily"
    const { data: dailyUpdate, error: dailyError } = await supabase
      .from('vlogs')
      .update({ category: 'Daily' })
      .eq('category', 'Daily Life');
    
    if (dailyError) {
      console.error('Error updating Daily Life categories:', dailyError);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update Daily Life categories',
        error: dailyError.message 
      });
    }
    
    // Update "Tech Talks" to "Tech"
    const { data: techUpdate, error: techError } = await supabase
      .from('vlogs')
      .update({ category: 'Tech' })
      .eq('category', 'Tech Talks');
    
    if (techError) {
      console.error('Error updating Tech Talks categories:', techError);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update Tech Talks categories',
        error: techError.message 
      });
    }
    
    console.log('✅ Categories updated successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Categories updated successfully',
      updates: {
        dailyUpdated: dailyUpdate,
        techUpdated: techUpdate
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating categories:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
