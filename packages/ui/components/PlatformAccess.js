import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { hasPlatformAccess, grantPlatformAccess, revokePlatformAccess } from '@neothink/core';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';
export function PlatformAccess({ userId, onUpdate }) {
    const [platformAccess, setPlatformAccess] = useState({
        hub: false,
        ascenders: false,
        neothinkers: false,
        immortals: false
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const { toast } = useToast();
    // Fetch current platform access
    useEffect(() => {
        async function fetchAccess() {
            setLoading(true);
            try {
                const platforms = ['hub', 'ascenders', 'neothinkers', 'immortals'];
                const access = {
                    hub: false,
                    ascenders: false,
                    neothinkers: false,
                    immortals: false
                };
                // Check access for each platform
                await Promise.all(platforms.map(async (platform) => {
                    access[platform] = await hasPlatformAccess(platform, userId);
                }));
                setPlatformAccess(access);
            }
            catch (error) {
                console.error('Error fetching platform access:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to fetch platform access information',
                    variant: 'destructive'
                });
            }
            finally {
                setLoading(false);
            }
        }
        fetchAccess();
    }, [userId, toast]);
    // Toggle platform access
    async function toggleAccess(platform) {
        setUpdating(platform);
        try {
            if (platformAccess[platform]) {
                await revokePlatformAccess(platform, userId);
                toast({
                    title: 'Access Revoked',
                    description: `User no longer has access to ${platform}`,
                });
            }
            else {
                await grantPlatformAccess(platform, userId);
                toast({
                    title: 'Access Granted',
                    description: `User now has access to ${platform}`,
                });
            }
            // Update local state
            setPlatformAccess(prev => (Object.assign(Object.assign({}, prev), { [platform]: !prev[platform] })));
            // Notify parent component
            if (onUpdate) {
                onUpdate();
            }
        }
        catch (error) {
            console.error(`Error updating ${platform} access:`, error);
            toast({
                title: 'Error',
                description: `Failed to update ${platform} access`,
                variant: 'destructive'
            });
        }
        finally {
            setUpdating(null);
        }
    }
    return (<Card>
      <CardHeader>
        <CardTitle>Platform Access</CardTitle>
        <CardDescription>Manage which platforms this user can access</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (<div className="flex justify-center py-4">Loading...</div>) : (<div className="space-y-4">
            {Object.keys(platformAccess).map(platform => (<div key={platform} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="capitalize">{platform}</span>
                  {platformAccess[platform] && (<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>)}
                </div>
                <Button variant={platformAccess[platform] ? "destructive" : "default"} size="sm" onClick={() => toggleAccess(platform)} disabled={updating === platform}>
                  {updating === platform
                    ? 'Updating...'
                    : platformAccess[platform]
                        ? 'Revoke Access'
                        : 'Grant Access'}
                </Button>
              </div>))}
          </div>)}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Changes are applied immediately
      </CardFooter>
    </Card>);
}
//# sourceMappingURL=PlatformAccess.js.map