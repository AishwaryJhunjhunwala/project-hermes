'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createMember, updateMember } from '@/app/actions/admin/members';
import type { Member, MemberFormData } from '@/types/member';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onSuccess: () => void;
}

export function MemberFormDialog({ open, onOpenChange, member, onSuccess }: Props) {
  const getInitial = (): MemberFormData => {
    if (member) {
      return {
        name: member.name,
        year: member.year,
        memberType: member.memberType,
        designation: member.designation ?? undefined,
        role: member.role ?? undefined,
        imageUrl: member.imageUrl,
        linkedinUrl: member.linkedinUrl ?? undefined,
        githubUrl: member.githubUrl ?? undefined,
        twitterUrl: member.twitterUrl ?? undefined,
      } as MemberFormData;
    }
    return {
      name: '',
      year: new Date().getFullYear(),
      memberType: 'CORE',
      imageUrl: '',
    } as MemberFormData;
  };

  const [form, setForm] = useState<MemberFormData>(getInitial());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) setForm(getInitial());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!form.imageUrl.trim()) {
      toast.error('Image URL is required');
      return;
    }

    setIsSubmitting(true);

    const res = member ? await updateMember(member.id, form) : await createMember(form);

    setIsSubmitting(false);

    if (res.success) {
      toast.success(member ? 'Member updated' : 'Member created');
      onSuccess();
    } else {
      toast.error(res.error || 'Failed to save member');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Member' : 'Create New Member'}</DialogTitle>
          <DialogDescription>
            {member ? 'Edit member details' : 'Fill in details to create a member'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Member Type *</Label>
              <Select
                value={form.memberType}
                onValueChange={(v: 'EXECUTIVE' | 'CORE') => setForm({ ...form, memberType: v })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXECUTIVE">EXECUTIVE</SelectItem>
                  <SelectItem value="CORE">CORE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.memberType === 'EXECUTIVE' ? (
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={form.designation || ''}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={form.role || ''}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL *</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={form.linkedinUrl || ''}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={form.githubUrl || ''}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={form.twitterUrl || ''}
                onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : member ? 'Update Member' : 'Create Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
