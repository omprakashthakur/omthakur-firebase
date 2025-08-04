
import { NextResponse } from 'next/server';
import { vlogs } from '@/lib/data';
import type { Vlog } from '@/lib/data';

// GET a single vlog by id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const vlog = vlogs.find(v => v.id === Number(params.id));
  if (vlog) {
    return NextResponse.json(vlog);
  }
  return NextResponse.json({ message: 'Vlog not found' }, { status: 404 });
}

// PUT (update) a vlog by id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedVlogData: Partial<Omit<Vlog, 'id'>> = await request.json();
    const vlogIndex = vlogs.findIndex(v => v.id === Number(params.id));

    if (vlogIndex === -1) {
      return NextResponse.json({ message: 'Vlog not found' }, { status: 404 });
    }

    const updatedVlog = { 
      ...vlogs[vlogIndex], 
      ...updatedVlogData,
    };
    vlogs[vlogIndex] = updatedVlog;

    return NextResponse.json(updatedVlog);
  } catch (error) {
    let errorMessage = 'Error updating vlog';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// DELETE a vlog by id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const vlogIndex = vlogs.findIndex(v => v.id === Number(params.id));

  if (vlogIndex === -1) {
    return NextResponse.json({ message: 'Vlog not found' }, { status: 404 });
  }

  const deletedVlog = vlogs.splice(vlogIndex, 1);

  return NextResponse.json({ message: 'Vlog deleted successfully', vlog: deletedVlog[0] });
}
